$(document).ready(function () {

    $('#select-doctor').change(function () {
        $('#create-cat').submit();
    });

    $(function () {
        $('select[name="permissions[]"]').bootstrapDualListbox({
            nonSelectedListLabel: 'Available permissions',
            selectedListLabel: 'Selected permissions',
            preserveSelectionOnMove: 'moved',
            moveOnSelect: true
        });
    });

    $(function () {
        var roles = $('select[name="roles[]"]').bootstrapDualListbox({
            nonSelectedListLabel: 'Available roles',
            selectedListLabel: 'Assigned roles',
            preserveSelectionOnMove: 'moved',
            moveOnSelect: true
        });
    });

    $(function () {
        $(".datepicker").datepicker({
            todayHighlight: true,
            autoclose: true,
            format: 'dd-mm-yyyy'

        });
    });

    var config = {
        '.chosen-select': {},
        '.chosen-select-deselect': {allow_single_deselect: true},
        '.chosen-select-no-single': {disable_search_threshold: 10},
        '.chosen-select-no-results': {no_results_text: 'Oops, nothing found!'},
        '.chosen-select-width': {width: "95%"}
    }
    for (var selector in config) {
        $(selector).chosen(config[selector]);
    }

    $('.alert-success').delay(3000).slideUp();

    /* Create Doctor Validation */
    $("#create-doctor").validate({
        rules: {
            first_name: "required",
            last_name: "required"
        }
    });

    /* CV Upload, Delete and File Extension Validation */


    $("#cv_file").change(function () {
        $('#cv').submit();
    });
    $("#cv .last_updated_date").on('change', function (e) {
        $('#cv').submit();
    });
    $("#cv").validate({
        rules: {
            last_date_updated: "required"
        }
    });

    //extension validation
    //$( "#cv_file" ).change(function() {
    //    var file = $('input[name="cv"]').val();
    //    var exts = ['doc','docx','rtf','odt', 'pdf'];
    //    // first check if file field has any value
    //    if ( file ) {
    //        // split file name at dot
    //        var get_ext = file.split('.');
    //        // reverse name to check extension
    //        get_ext = get_ext.reverse();
    //        // check file type is valid as given in 'exts' array
    //        if ( $.inArray ( get_ext[0].toLowerCase(), exts ) > -1 ){
    //            $('#cv').submit();
    //        } else {
    //            $('.success').hide();
    //            $('#cv-error').html('The files with extensions pdf, doc, docx, rtf or odt are only allowed.');
    //        }
    //    }
    //});

    //upload
    (function () {
        var bar = $('.cv-progress-bar');
        var mainarea = $('.cv-upload');
        var view = $('.cv-view');
        var url = $('.url').html();

        $('#cv').ajaxForm({
            beforeSend: function () {
                $('.success').hide();
            },
            uploadProgress: function (event, position, total, percentComplete) {
                bar.html('<img src="/assets/admin/img/loader.gif">');
            },
            success: function () {
                bar.empty();
            },
            complete: function (xhr) {
                if (xhr.responseText != '') {
                    if (xhr.responseText != 'date_updated') {
                        mainarea.addClass('success-upload');
                        bar.empty();
                        view.attr('href', url + '/uploads/doctors/cv/' + xhr.responseText);
                        view.attr('target', '_blank');
                        $('.success').slideToggle();
                        $('.success').html('CV Uploaded Successfully !');
                    }
                }
            }
        });

    })();

    //delete
    $('.cv-delete').on('click', function (e) {
        e.preventDefault();
        $.ajax({
            method: 'GET',
            url: $(this).attr('href'),
            success: function (response) {
                if (response != '') {
                    $('.success').hide();
                    $('.success').slideToggle();
                    $('.success').html(JSON.parse(response));
                    $('.cv-view').removeAttr('href', 'target');
                    $('.cv-upload').removeClass('success-upload');
                    $('.last_updated_date').val('');
                }
                else {
                    $('.success').hide();
                }

            }
        })
    });


    /* REF 1 Upload, Delete and File Extension Validation */

    $("#ref1_file").change(function () {
        $('#ref1').submit();
    });
    $("#ref1 .last_worked_date_ref1").on('change', function (e) {
        $('#ref1').submit();
    });
    $("#ref1").validate({
        rules: {
            last_date_worked: "required"
        }
    });

    //extension validation
    //$( "#ref1_file" ).change(function() {
    //    var file = $('input[name="ref1"]').val();
    //    var exts = ['doc','docx','rtf','odt', 'pdf'];
    //    // first check if file field has any value
    //    if ( file ) {
    //        // split file name at dot
    //        var get_ext = file.split('.');
    //        // reverse name to check extension
    //        get_ext = get_ext.reverse();
    //        // check file type is valid as given in 'exts' array
    //        if ( $.inArray ( get_ext[0].toLowerCase(), exts ) > -1 ){
    //            $('#ref1').submit();
    //        } else {
    //            $('.success').hide();
    //            $('#ref1-error').html('The files with extensions pdf, doc, docx, rtf or odt are only allowed.');
    //        }
    //    }
    //});

    //upload
    (function () {
        var bar = $('.ref1-progress-bar');
        var mainarea = $('.ref1-upload');
        var view = $('.ref1-view');
        var url = $('.url').html();

        $('#ref1').ajaxForm({
            beforeSend: function () {
                $('.success').hide();
            },
            uploadProgress: function (event, position, total, percentComplete) {
                bar.html('<img src="/assets/admin/img/loader.gif">');
                view.attr('href', '');

            },
            success: function () {
                bar.empty();
            },
            complete: function (xhr) {
                if (xhr.responseText != '') {
                    if (xhr.responseText != 'date_updated') {
                        mainarea.addClass('success-upload');
                        bar.empty();
                        view.attr('href', url + '/uploads/doctors/ref1/' + xhr.responseText);
                        view.attr('target', '_blank');
                        $('.success').slideToggle();
                        $('.success').html('REF 1 Uploaded Successfully !');
                    }
                }
            }
        });

    })();

    //delete
    $('.ref1-delete').on('click', function (e) {
        e.preventDefault();
        $.ajax({
            method: 'GET',
            url: $(this).attr('href'),
            success: function (response) {
                if (response != '') {
                    $('.success').hide();
                    $('.success').slideToggle();
                    $('.success').html(JSON.parse(response));
                    $('.ref1-view').removeAttr('href', 'target');
                    $('.ref1-upload').removeClass('success-upload');
                    $('.last_worked_date_ref1').val('');
                }
                else {
                    $('.success').hide();
                }

            }
        })
    });

    /* REF 2 Upload, Delete and File Extension Validation */

    $("#ref2_file").change(function () {
        $('#ref2').submit();
    });
    $("#ref2 .last_worked_date_ref2").on('change', function (e) {
        $('#ref2').submit();
    });
    $("#ref2").validate({
        rules: {
            last_date_worked: "required"
        }
    });

    //extension validation
    //$( "#ref2_file" ).change(function() {
    //    var file = $('input[name="ref2"]').val();
    //    var exts = ['doc','docx','rtf','odt', 'pdf'];
    //    // first check if file field has any value
    //    if ( file ) {
    //        // split file name at dot
    //        var get_ext = file.split('.');
    //        // reverse name to check extension
    //        get_ext = get_ext.reverse();
    //        // check file type is valid as given in 'exts' array
    //        if ( $.inArray ( get_ext[0].toLowerCase(), exts ) > -1 ){
    //            $('#ref2').submit();
    //        } else {
    //            $('.success').hide();
    //            $('#ref2-error').html('The files with extensions pdf, doc, docx, rtf or odt are only allowed.');
    //        }
    //    }
    //});

    //upload
    (function () {
        var bar = $('.ref2-progress-bar');
        var mainarea = $('.ref2-upload');
        var view = $('.ref2-view');
        var url = $('.url').html();

        $('#ref2').ajaxForm({
            beforeSend: function () {
                $('.success').hide();
            },
            uploadProgress: function (event, position, total, percentComplete) {
                bar.html('<img src="/assets/admin/img/loader.gif">');
                view.attr('href', '');

            },
            success: function () {
                bar.empty();
            },
            complete: function (xhr) {
                if (xhr.responseText != '') {
                    if (xhr.responseText != 'date_updated') {
                        mainarea.addClass('success-upload');
                        bar.empty();
                        view.attr('href', url + '/uploads/doctors/ref2/' + xhr.responseText);
                        view.attr('target', '_blank');
                        $('.success').slideToggle();
                        $('.success').html('REF 2 Uploaded Successfully !');
                    }
                }
            }
        });

    })();

    //delete
    $('.ref2-delete').on('click', function (e) {
        e.preventDefault();
        $.ajax({
            method: 'GET',
            url: $(this).attr('href'),
            success: function (response) {
                if (response != '') {
                    $('.success').hide();
                    $('.success').slideToggle();
                    $('.success').html(JSON.parse(response));
                    $('.ref2-view').removeAttr('href', 'target');
                    $('.ref2-upload').removeClass('success-upload');
                    $('.last_worked_date_ref2').val('');
                }
                else {
                    $('.success').hide();
                }

            }
        })
    });


    /* REF 3 Upload, Delete and File Extension Validation */

    $("#ref3_file").change(function () {
        $('#ref3').submit();
    });
    $("#ref3 .last_worked_date_ref3").on('change', function (e) {
        $('#ref3').submit();
    });
    $("#ref3").validate({
        rules: {
            last_date_worked: "required"
        }
    });

    //extension validation
    //$( "#ref3_file" ).change(function() {
    //    var file = $('input[name="ref3"]').val();
    //    var exts = ['doc','docx','rtf','odt', 'pdf'];
    //    // first check if file field has any value
    //    if ( file ) {
    //        // split file name at dot
    //        var get_ext = file.split('.');
    //        // reverse name to check extension
    //        get_ext = get_ext.reverse();
    //        // check file type is valid as given in 'exts' array
    //        if ( $.inArray ( get_ext[0].toLowerCase(), exts ) > -1 ){
    //            $('#ref3').submit();
    //        } else {
    //            $('.success').hide();
    //            $('#ref3-error').html('The files with extensions pdf, doc, docx, rtf or odt are only allowed.');
    //        }
    //    }
    //});

    //upload
    (function () {
        var bar = $('.ref3-progress-bar');
        var mainarea = $('.ref3-upload');
        var view = $('.ref3-view');
        var url = $('.url').html();

        $('#ref3').ajaxForm({
            beforeSend: function () {
                $('.success').hide();
            },
            uploadProgress: function (event, position, total, percentComplete) {
                bar.html('<img src="/assets/admin/img/loader.gif">');
                view.attr('href', '');

            },
            success: function () {
                bar.empty();
            },
            complete: function (xhr) {
                if (xhr.responseText != '') {
                    if (xhr.responseText != 'date_updated') {
                        mainarea.addClass('success-upload');
                        bar.empty();
                        view.attr('href', url + '/uploads/doctors/ref3/' + xhr.responseText);
                        view.attr('target', '_blank');
                        $('.success').slideToggle();
                        $('.success').html('REF 3 Uploaded Successfully !');
                    }
                }
            }
        });

    })();

    //delete
    $('.ref3-delete').on('click', function (e) {
        e.preventDefault();
        $.ajax({
            method: 'GET',
            url: $(this).attr('href'),
            success: function (response) {
                if (response != '') {
                    $('.success').hide();
                    $('.success').slideToggle();
                    $('.success').html(JSON.parse(response));
                    $('.ref3-view').removeAttr('href', 'target');
                    $('.ref3-upload').removeClass('success-upload');
                    $('.last_worked_date_ref3').val('');
                }
                else {
                    $('.success').hide();
                }

            }
        })
    });


    /* GMC Upload, Delete and File Extension Validation */

    $("#gmc_file").change(function () {
        $('#gmc').submit();
    });
    $("#gmc .date_of_check").on('change', function (e) {
        $('#gmc').submit();
    });
    //save status on change
    $('.status').on('change', function (e) {
        var d_id = $('.doctor_id').html();
        var status = $('.status').val();
        $.ajax({
            method: 'GET',
            url: '/gmc/doctors/status/' + d_id + '/' + status,
            success: function (response) {

            }
        })
    });

    $("#gmc").validate({
        rules: {
            date_of_check: "required",
            status: "required"
        }
    });

    //upload
    (function () {
        var bar = $('.gmc-progress-bar');
        var mainarea = $('.gmc-upload');
        var view = $('.gmc-view');
        var url = $('.url').html();

        $('#gmc').ajaxForm({
            beforeSend: function () {
                $('.success').hide();
            },
            uploadProgress: function (event, position, total, percentComplete) {
                bar.html('<img src="/assets/admin/img/loader.gif">');
                view.attr('href', '');

            },
            success: function () {
                bar.empty();
            },
            complete: function (xhr) {
                if (xhr.responseText != '') {
                    if (xhr.responseText != 'date_updated') {
                        mainarea.addClass('success-upload');
                        bar.empty();
                        view.attr('href', url + '/uploads/doctors/gmc/' + xhr.responseText);
                        view.attr('target', '_blank');
                        $('.success').slideToggle();
                        $('.success').html('Latest GMC Check Uploaded Successfully !');
                    }
                }
            }
        });

    })();

    //delete
    $('.gmc-delete').on('click', function (e) {
        e.preventDefault();
        $.ajax({
            method: 'GET',
            url: $(this).attr('href'),
            success: function (response) {
                if (response != '') {
                    $('.success').hide();
                    $('.success').slideToggle();
                    $('.success').html(JSON.parse(response));
                    $('.gmc-view').removeAttr('href', 'target');
                    $('.gmc-upload').removeClass('success-upload');
                    $('.date_of_check').val('');
                    $('.status').val('');
                }
                else {
                    $('.success').hide();
                }

            }
        })
    });


    /* FTP Cert Upload, Delete and File Extension Validation */

    $("#ftpcert_file").change(function () {
        $('#ftpcert').submit();
    });
    $("#ftpcert .issue_date").on('change', function (e) {
        $('#ftpcert').submit();
    });
    $("#ftpcert .iCheck-helper").on('click', function (e) {
        setTimeout(function () {
            $('#ftpcert').submit();
        }, 1000);
    });
    $("#ftpcert").validate({
        rules: {
            issue_date: "required"
        }
    });

    //upload
    (function () {
        var bar = $('.ftpcert-progress-bar');
        var mainarea = $('.ftpcert-upload');
        var view = $('.ftpcert-view');
        var url = $('.url').html();

        $('#ftpcert').ajaxForm({
            beforeSend: function () {
                $('.success').hide();
            },
            uploadProgress: function (event, position, total, percentComplete) {
                bar.html('<img src="/assets/admin/img/loader.gif">');
                view.attr('href', '');

            },
            success: function () {
                bar.empty();
            },
            complete: function (xhr) {
                if (xhr.responseText != '') {
                    if (xhr.responseText != 'date_updated') {
                        mainarea.addClass('success-upload');
                        bar.empty();
                        view.attr('href', url + '/uploads/doctors/ftpcert/' + xhr.responseText);
                        view.attr('target', '_blank');
                        $('.success').slideToggle();
                        $('.success').html('FTP Cert Uploaded Successfully !');
                    }
                }
            }
        });

    })();

    //delete
    $('.ftpcert-delete').on('click', function (e) {
        e.preventDefault();
        $.ajax({
            method: 'GET',
            url: $(this).attr('href'),
            success: function (response) {
                if (response != '') {
                    $('.success').hide();
                    $('.success').slideToggle();
                    $('.success').html(JSON.parse(response));
                    $('.ftpcert-view').removeAttr('href', 'target');
                    $('.ftpcert-upload').removeClass('success-upload');
                    $('.issue_date').val('');
                    $('.epp').attr('checked', false);
                }
                else {
                    $('.success').hide();
                }

            }
        })
    });

    /* Recent Ebola Country Contact Upload, Delete and File Extension Validation */

    $("#ebola_file").change(function () {
        $('#ebola').submit();
    });
    $("#ebola .date_completed").on('change', function (e) {
        $('#ebola').submit();
    });
    $("#ebola .iCheck-helper").on('click', function (e) {
        setTimeout(function () {
            $('#ebola').submit();
        }, 1000);
    });

    $("#ebola").validate({
        rules: {
            date_completed: "required"
        }
    });

    //upload
    (function () {
        var bar = $('.ebola-progress-bar');
        var mainarea = $('.ebola-upload');
        var view = $('.ebola-view');
        var url = $('.url').html();

        $('#ebola').ajaxForm({
            beforeSend: function () {
                $('.success').hide();
            },
            uploadProgress: function (event, position, total, percentComplete) {
                bar.html('<img src="/assets/admin/img/loader.gif">');
                view.attr('href', '');

            },
            success: function () {
                bar.empty();
            },
            complete: function (xhr) {
                if (xhr.responseText != '') {
                    if (xhr.responseText != 'date_updated') {
                        mainarea.addClass('success-upload');
                        bar.empty();
                        view.attr('href', url + '/uploads/doctors/ebola/' + xhr.responseText);
                        view.attr('target', '_blank');
                        $('.success').slideToggle();
                        $('.success').html('Recent Ebola Country Contact Uploaded Successfully !');
                    }
                }
            }
        });

    })();

    //delete
    $('.ebola-delete').on('click', function (e) {
        e.preventDefault();
        $.ajax({
            method: 'GET',
            url: $(this).attr('href'),
            success: function (response) {
                if (response != '') {
                    $('.success').hide();
                    $('.success').slideToggle();
                    $('.success').html(JSON.parse(response));
                    $('.ebola-view').removeAttr('href', 'target');
                    $('.ebola-upload').removeClass('success-upload');
                    $('.date_completed').val('');
                    $('.ecc').attr('checked', false);
                }
                else {
                    $('.success').hide();
                }
            }
        })
    });

    /* Passport Upload, Delete and File Extension Validation */

    $("#passport_file").change(function () {
        $('#passport').submit();
    });
    $("#passport .expiry_date").on('change', function (e) {
        $('#ebola').submit();
    });
    $("#passport").validate({
        rules: {
            expiry_date: "required"
        }
    });

    //upload
    (function () {
        var bar = $('.passport-progress-bar');
        var mainarea = $('.passport-upload');
        var view = $('.passport-view');
        var url = $('.url').html();

        $('#passport').ajaxForm({
            beforeSend: function () {
                $('.success').hide();
            },
            uploadProgress: function (event, position, total, percentComplete) {
                bar.html('<img src="/assets/admin/img/loader.gif">');
                view.attr('href', '');

            },
            success: function () {
                bar.empty();
            },
            complete: function (xhr) {
                if (xhr.responseText != '') {
                    if (xhr.responseText != 'date_updated') {
                        mainarea.addClass('success-upload');
                        bar.empty();
                        view.attr('href', url + '/uploads/doctors/passport/' + xhr.responseText);
                        view.attr('target', '_blank');
                        $('.success').slideToggle();
                        $('.success').html('Passport Uploaded Successfully !');
                    }
                }
            }
        });

    })();

    //delete
    $('.passport-delete').on('click', function (e) {
        e.preventDefault();
        $.ajax({
            method: 'GET',
            url: $(this).attr('href'),
            success: function (response) {
                if (response != '') {
                    $('.success').hide();
                    $('.success').slideToggle();
                    $('.success').html(JSON.parse(response));
                    $('.passport-view').removeAttr('href', 'target');
                    $('.passport-upload').removeClass('success-upload');
                    $('.expiry_date').val('');
                }
                else {
                    $('.success').hide();
                }

            }
        })
    });

    /* HOC Upload, Delete and File Extension Validation */

    $("#hoc_file").change(function () {
        $('#hoc').submit();
    });

    //upload
    (function () {
        var bar = $('.hoc-progress-bar');
        var mainarea = $('.hoc-upload');
        var view = $('.hoc-view');
        var url = $('.url').html();

        $('#hoc').ajaxForm({
            beforeSend: function () {
                $('.success').hide();
            },
            uploadProgress: function (event, position, total, percentComplete) {
                bar.html('<img src="/assets/admin/img/loader.gif">');
                view.attr('href', '');

            },
            success: function () {
                bar.empty();
            },
            complete: function (xhr) {
                if (xhr.responseText != '') {
                    mainarea.addClass('success-upload');
                    bar.empty();
                    view.attr('href', url + '/uploads/doctors/hoc/' + xhr.responseText);
                    view.attr('target', '_blank');
                    $('.success').slideToggle();
                    $('.success').html('Home Office Correspondence Uploaded Successfully !');
                }
            }
        });

    })();

    //delete
    $('.hoc-delete').on('click', function (e) {
        e.preventDefault();
        $.ajax({
            method: 'GET',
            url: $(this).attr('href'),
            success: function (response) {
                if (response != '') {
                    $('.success').hide();
                    $('.success').slideToggle();
                    $('.success').html(JSON.parse(response));
                    $('.hoc-view').removeAttr('href', 'target');
                    $('.hoc-upload').removeClass('success-upload');
                }
                else {
                    $('.success').hide();
                }

            }
        })
    });

    /* Visa Upload, Delete and File Extension Validation */

    $("#visa_file").change(function () {
        $('#visa').submit();
    });
    $("#visa .expiry_date_visa").on('change', function (e) {
        $('#visa').submit();
    });
    $("#visa .visa_type").on('change', function (e) {
        $('#visa').submit();
    });
    $("#visa").validate({
        rules: {
            expiry_date: "required",
            visa_type: "required"
        }
    });

    //save status on change
    $('.visa_type').on('change', function (e) {
        // if ($(this).val() == '35') { //if his visa is UK National
        //     $('.visa-upload').addClass('success-upload');
        //     $('.expiry_date_visa').attr('disabled', true);
        //     $('#visa_file').attr('disabled', true);
        //
        // }
        // else if ($(this).val() == '14') {
        //     $('.expiry_date_visa').attr('disabled', true);
        //     $('.visa-upload').removeClass('success-upload');
        //     $('#visa_file').attr('disabled', false);
        // }
        // else {
        //     $('.visa-upload').removeClass('success-upload');
        //     $('.expiry_date_visa').attr('disabled', false);
        //     $('#visa_file').attr('disabled', false);
        // }
        var d_id = $('.doctor_id').html();
        var visa_type = $('.visa_type').val();
        $.ajax({
            method: 'GET',
            url: '/visa/doctors/visatype/' + d_id + '/' + visa_type,
            success: function (response) {

            }
        })
    });

    //upload
    (function () {
        var bar = $('.visa-progress-bar');
        var mainarea = $('.visa-upload');
        var view = $('.visa-view');
        var url = $('.url').html();

        $('#visa').ajaxForm({
            beforeSend: function () {
                $('.success').hide();
            },
            uploadProgress: function (event, position, total, percentComplete) {
                bar.html('<img src="/assets/admin/img/loader.gif">');
                view.attr('href', '');

            },
            success: function () {
                bar.empty();
            },
            complete: function (xhr) {
                if (xhr.responseText != '') {
                    if (xhr.responseText != 'date_updated') {
                        mainarea.addClass('success-upload');
                        bar.empty();
                        view.attr('href', url + '/uploads/doctors/visa/' + xhr.responseText);
                        view.attr('target', '_blank');
                        $('.success').slideToggle();
                        $('.success').html('Visa Uploaded Successfully !');
                    }
                }
            }
        });

    })();

    //delete
    $('.visa-delete').on('click', function (e) {
        e.preventDefault();
        $.ajax({
            method: 'GET',
            url: $(this).attr('href'),
            success: function (response) {
                if (response != '') {
                    $('.success').hide();
                    $('.success').slideToggle();
                    $('.success').html(JSON.parse(response));
                    $('.visa-view').removeAttr('href', 'target');
                    $('.visa-upload').removeClass('success-upload');
                    $('.expiry_date_visa').val('');
                }
                else {
                    $('.success').hide();
                }

            }
        })
    });


    /* Life Support Upload, Delete and File Extension Validation */

    $("#life_support_file").change(function () {
        $('#life_support').submit();
    });
    $("#life_support").validate({
        rules: {
            expiry_date: "required",
            issue_date: "required",
            qualification: "required"
        }
    });

    //save qualification on change
    $('.qualification').on('change', function (e) {
        var d_id = $('.doctor_id').html();
        var qualification = $('.qualification').val();
        $.ajax({
            method: 'GET',
            url: '/life_support/doctors/qualification/' + d_id + '/' + qualification,
            success: function (response) {

            }
        })
    });
    //save issue date on change
    $('.issue_date_life_support').on('change', function (e) {
        var d_id = $('.doctor_id').html();
        var issue_date = $('.issue_date_life_support').val();
        $.ajax({
            method: 'GET',
            url: '/life_support/doctors/issuedate/' + d_id + '/' + issue_date,
            success: function (response) {

            }
        })
    });
    //save expiry date on change
    $('.expiry_date_life_support').on('change', function (e) {
        var d_id = $('.doctor_id').html();
        var expiry_date = $('.expiry_date_life_support').val();
        $.ajax({
            method: 'GET',
            url: '/life_support/doctors/expirydate/' + d_id + '/' + expiry_date,
            success: function (response) {

            }
        })
    });

    //upload
    (function () {
        var bar = $('.life_support-progress-bar');
        var mainarea = $('.life_support-upload');
        var view = $('.life_support-view');
        var url = $('.url').html();

        $('#life_support').ajaxForm({
            beforeSend: function () {
                $('.success').hide();
            },
            uploadProgress: function (event, position, total, percentComplete) {
                bar.html('<img src="/assets/admin/img/loader.gif">');
                view.attr('href', '');

            },
            success: function () {
                bar.empty();
            },
            complete: function (xhr) {
                if (xhr.responseText != '') {
                    mainarea.addClass('success-upload');
                    bar.empty();
                    view.attr('href', url + '/uploads/doctors/life_support/' + xhr.responseText);
                    view.attr('target', '_blank');
                    $('.success').slideToggle();
                    $('.success').html('Life Support File Uploaded Successfully !');
                }
            }
        });

    })();

    //delete
    $('.life_support-delete').on('click', function (e) {
        e.preventDefault();
        $.ajax({
            method: 'GET',
            url: $(this).attr('href'),
            success: function (response) {
                if (response != '') {
                    $('.success').hide();
                    $('.success').slideToggle();
                    $('.success').html(JSON.parse(response));
                    $('.life_support-view').removeAttr('href', 'target');
                    $('.life_support-upload').removeClass('success-upload');
                    $('.expiry_date_life_support').val('');
                    $('.issue_date_life_support').val('');
                    $('.qualification').val('');
                }
                else {
                    $('.success').hide();
                }

            }
        })
    });

    /* Police Check Upload, Delete and File Extension Validation */

    $("#police_check_file").change(function () {
        $('#police_check').submit();
    });
    $("#police_check").validate({
        rules: {
            disclosure_no: "required",
            issue_date: "required"
        }
    });

    //save qualification on change
    $('.disclosure_no_police_check').on('change', function (e) {
        var d_id = $('.doctor_id').html();
        var disclosure = $('.disclosure_no_police_check').val();
        $.ajax({
            method: 'GET',
            url: '/police_check/doctors/disclosure/' + d_id + '/' + disclosure,
            success: function (response) {

            }
        })
    });
    //save issue date on change
    $('.issue_date_police_check').on('change', function (e) {
        var d_id = $('.doctor_id').html();
        var issue_date = $('.issue_date_police_check').val();
        $.ajax({
            method: 'GET',
            url: '/police_check/doctors/issuedate/' + d_id + '/' + issue_date,
            success: function (response) {

            }
        })
    });
    //save expiry date on change
    $('.status-police-check').on('change', function (e) {
        var d_id = $('.doctor_id').html();
        var status = $('.status-police-check').val();
        $.ajax({
            method: 'GET',
            url: '/police_check/doctors/status/' + d_id + '/' + status,
            success: function (response) {

            }
        })
    });

    $("#police_check .iCheck-helper").click(function () {
        setTimeout(function () {
            var d_id = $('.doctor_id').html();
            if ($('#police_check .dbs').is(':checked'))
                dbs = 1;
            else
                dbs = 0;
            $.ajax({
                method: 'GET',
                url: '/police_check/doctors/onlinedbs/' + d_id + '/' + dbs,
                success: function (response) {

                }
            })
        }, 1000);
    });

    //upload
    (function () {
        var bar = $('.police_check-progress-bar');
        var mainarea = $('.police_check-upload');
        var view = $('.police_check-view');
        var url = $('.url').html();

        $('#police_check').ajaxForm({
            beforeSend: function () {
                $('.success').hide();
            },
            uploadProgress: function (event, position, total, percentComplete) {
                bar.html('<img src="/assets/admin/img/loader.gif">');
                view.attr('href', '');

            },
            success: function () {
                bar.empty();
            },
            complete: function (xhr) {
                if (xhr.responseText != '') {
                    mainarea.addClass('success-upload');
                    bar.empty();
                    view.attr('href', url + '/uploads/doctors/police_check/' + xhr.responseText);
                    view.attr('target', '_blank');
                    $('.success').slideToggle();
                    $('.success').html('Police Check File Uploaded Successfully !');
                }
            }
        });

    })();

    //delete
    $('.police_check-delete').on('click', function (e) {
        e.preventDefault();
        $.ajax({
            method: 'GET',
            url: $(this).attr('href'),
            success: function (response) {
                if (response != '') {
                    $('.success').hide();
                    $('.success').slideToggle();
                    $('.success').html(JSON.parse(response));
                    $('.police_check-view').removeAttr('href', 'target');
                    $('.police_check-upload').removeClass('success-upload');
                    $('.expiry_date_police_check').val('');
                    $('.issue_date_police_check').val('');
                    $('.qualification').val('');
                }
                else {
                    $('.success').hide();
                }

            }
        })
    });

    /* Master Vendor Declaration Save */

    $("#master_vendor_declaration").find('input').change(function () {
        $('#master_vendor_declaration').submit();
    });

    $("#master_vendor_declaration").find('.icheckbox_square-green').click(function () {
        setTimeout(function () {
            $('#master_vendor_declaration').submit();
        }, 3000);
    });

    //ajax save
    (function () {
        $('.success').hide();
        $('#master_vendor_declaration').ajaxForm();
    })();

    /* Direct Engagement */
    //$('.way_of_working').change(function () {
    //    var val = $(this).val();
    //    if (val == 'PSC') {
    //        $('.brookson_umbrella').slideUp();
    //        $('.psc').slideDown();
    //    }
    //    else if (val == 'Brookson Umbrella') {
    //        $('.psc').slideUp();
    //        $('.brookson_umbrella').slideDown();
    //    }
    //    else {
    //        $('.psc').slideUp();
    //        $('.brookson_umbrella').slideUp();
    //    }
    //    $('#direct-engagement').submit();
    //});
    //
    //$("#direct-engagement").find('input').change(function () {
    //    $('#direct-engagement').submit();
    //});
    //
    //$("#direct-engagement").find('textarea').change(function () {
    //    $('#direct-engagement').submit();
    //});
    //ajax save
    (function () {
        $('#direct-engagement').ajaxForm({
            complete: function (xhr) {
                if (xhr.responseText != '') {
                    $('.direct-engagement-success').slideDown(300).delay(3000).slideUp();
                }
            }
        });
    })();


    //ajax save
    //(function () {
    //    $('#personal-details-form').ajaxForm({
    //        complete: function (xhr) {
    //            if (xhr.responseText != '') {
    //                $('.personal-success').slideDown(300).delay(3000).slideUp();
    //            }
    //        }
    //    });
    //})();

});