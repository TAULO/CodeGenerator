
var in_lite_lw = null;

var instanceLotEdit = null;
var LotEdit = function () {
    this.status = null;
};
LotEdit.prototype = Object.create(Global);
LotEdit.prototype.init = function () {
        var event,
            $document = $(document),
            object = this;

        this.status = null;

        event = ['click', '.lot-edit button, .lot-edit .dropdown-menu li'];
        $document.off(event[0], event[1]).on(event[0], event[1], function () {
            var $this = $(this),
                idValue = $this.data('id');

            if (typeof idValue != 'undefined' && !idValue.length) return;

            object.status = true;
        });
        event = ['keyup','.lot-edit input[type=text]'];
        $document.off(event[0], event[1]).on(event[0], event[1], this.onChangeValue);

        event = ['change', '.lot-edit input[type=text], .lot-edit textarea, .lot-edit select, .lot-edit .element[data-type="drop_down"], .lot-edit button[type="submit"]'];
        $document.off(event[0], event[1]).on(event[0], event[1], this.onChangeValueSetAttr);

        event = ['click', '.lot-edit .element[data-type="drop_down"]']
        $document.off(event[0], event[1]).on(event[0], event[1], this.onChangeValueSetAttr);

        event = ['click', '.lot-edit .refresh'];
        $document.off(event[0], event[1]).on(event[0], event[1], function () {
            if (object.status === true && object.status != 'showed') {
                object.save();
            }
        });
    };
LotEdit.prototype.save = function () {
        var data = {},
            object = this,
            copyId = $('.list_view_block').data('copy_id'),
            inputs = $('.lot-edit').find('input[type=text]'), //:visible
            formulaIsNotValid = true;

        $.each(inputs, function (key,val) {
            var field,
                $input = $(val),
                value = $input.val(),
                name = $input.attr('name');

            if (name) {
                field = name.substring(name.indexOf('[')+1,name.length -1);

                if ($input.closest('.bootstrap-timepicker').length) {
                    return true;
                }

                switch (inLineEdit.getType(field).type) {
                    case 'numeric': {
                        if ($input.is('.color-red')) {
                            formulaIsNotValid = false;
                        }
                        if (value.indexOf('=')==0) {
                            data[field] = value;
                        }

                        break;
                    }
                    default: {
                        break;
                    }
                }
            }
        });

        if (!formulaIsNotValid || !$('.list-table input.checkbox:checked').length) return;

        $.ajax({
            url : Global.urls.list_view_formula_check + '/' + copyId,
            data : data,
            type : 'POST',
            dataType: "json",
            async: true,
            success: function(data){
                if(data.status){
                    modalDialog.show(data.data, true);
                    if (!$('.modal-backdrop.in').length) {
                        $('body').append('<div class="modal-backdrop in"></div>');
                    }
                } else {
                    if(!data.status ) {
                        var elements = $('.lot-edit [type="text"]');

                        elements.removeClass('color-green').removeClass('color-red');
                        $.each(data.errors, function (key, data) {
                            elements.filter('[name*="'+data+'"]').addClass('color-red');
                        });
                    }
                }
            },
        });

        $(document).on('click', '.close-button, .modal.in', function () {
            if ($('.modal-backdrop.in').length && !$('.modal.in').length) {
                $('.modal-backdrop.in').remove();
            }
        });

        $(document).off('click', '.element[data-type="lot-edit"] .btn-primary');
        $(document).on('click', '.element[data-type="lot-edit"] .btn-primary', this.onChangeData);
        $(document).on('click', '.element[data-type="lot-edit"] [data-dismiss="modal"]', function () {
            object.remove();
        });
    }
LotEdit.prototype.onClickByBtnLotEdit = function ($this) {
    var $table = $('#list-table'),
        list = $table.find('.checkbox[type="checkbox"]:checked'),
        editing = $table.find('.editing');

    if (editing.length) {
        inLineEdit.cancel(editing, function (data) {
            if (data.status) {
                inLineEdit.add(true);
            }
        });
    } else {
        inLineEdit.add(true);
        $this.closest('.open').removeClass('open')
    }
}
LotEdit.prototype.onChangeValueSetAttr = function(){
    instanceLotEdit.status = true;
    $(this).closest('.data_edit').addClass('editing');
}
LotEdit.prototype.onChangeValue = function(e){
    var element,
        allowed = ['=','+','-','*','/'],
        allowedCode = [8,13, 16,17, 35,36,37,38, 39,40, 46, 48, 57, 110, 111, 187,189],
                    //[ 8 - beck space,
                    // 38 - arrow up
                    // 40 - arrow down
                    //16,17, 35,36,37,39, 46, 48, 57, 110, 111, 187,189]
        $this = $(this),
        operator = ['*','+','-','/'],
        value = $this.val(),
        clearColor = function () {
            $this.removeClass('color-green').removeClass('color-red');
        },
        name = $this.attr('name');

    instanceLotEdit.status = true;

    if (e.keyCode == 27) {
        $('.lot-edit.editing').remove();
        instanceLotEdit.remove();
        in_lite_lw = null;
    }

    element = inLineEdit.getType(name.substring(name.indexOf('[')+1, name.length-1));


    if ($.inArray(e.key, allowed)<0) {
        if ($.inArray(e.keyCode, allowedCode)<0) {
            if (element.type == 'numeric' && isNaN(Number(e.key))) {
                $this.val(value.substring(0, value.indexOf(e.key)));
            }
        }
    }

    clearColor();
    if (value.length>1 && element.type == 'numeric' && value[0] == '=') {
        if (value.indexOf('(')>0 && value.indexOf(')')<0
            || (value[0]=='=' && $.inArray(value[1],operator)<0)) {
            clearColor();
            $this.addClass('color-red');
        }
        if (value.indexOf(' ')>=0) {
            value = $.trim(value);
            $this.val(value.replace(/\s+/g, ''));
        }
        if ($.inArray(value[1], operator)>=0 && value.length>=3) {
            $this.addClass('color-green');
        }
    };

    return false;
}
LotEdit.prototype.preSave = function () {
    var r = false;

    if ($('.lot-edit.editing').length) {

        if (this.status === 'showed') {
            this.status = null;
            instanceLotEdit.remove();
            niceScroll.update($('#list-table_wrapper'));
        } else {
            if (this.status === true) this.save();
            this.status = 'showed';
        }
        r = true;
    }

    return r; // if true - then exit from logic in parent method
}

LotEdit.prototype.remove = function () {
    $('.lot-edit').remove();
    $(document).off('click', '.close-button, .modal.in');
    $(document).off('click', '[data-type="lot-edit"] .close-button');
    instanceLotEdit = null;
}



LotEdit.prototype.onChangeData = function () {
    var $this = $(this);

    Global.btnSaveSetDisabled($this, 'disabled');
    instanceGlobal.preloaderShow($this);

    var tr = $('.list_view_block #list-table tbody > tr.editing.lot-edit');

    if(tr.length == false){
        instanceGlobal.contentReload.preloaderHide();
        return;
    }

    inLineEdit.save(tr, function(data){
        if(data.status == true){
            in_lite_lw = null;
            instanceLotEdit.remove();

            instanceGlobal.contentReload
                .prepareVariablesToGeneralContent()
                .setCallBackSuccessComplete(function () {
                    modalDialog.hide();
                    $('.modal-backdrop.in').remove();
                })
                .run();

        } else {
            instanceGlobal.contentReload.preloaderHide();
        }
    });
}


var InLineSet = function(e, isEditElement, event){
    if(inLineEdit.elements == false) return;

    if(e && $(e.target).closest('#list-table').length > 0 && isEditElement == false) return;

    if(in_lite_lw === null || (instanceLotEdit && instanceLotEdit.preSave())) return;

    if(inLineEdit.isEditing($('#list-table'))){
        if(event == 'save'){
            if($(e.target).hasClass('inline_dnt-add')) return;
            inLineEdit.save($(in_lite_lw).closest('tbody').find('tr.editing'), function(data){
                if(data.status == true){
                    inLineEdit.removeClassEditing($(in_lite_lw).closest('#list-table'));
                    in_lite_lw = null;
                }
            });
        }
        if(event == 'cancel'){
            inLineEdit.cancel($(in_lite_lw).closest('tbody').find('tr.editing'), function(data){
                if(data.status == true){
                    in_lite_lw = null;
                    setCheckboxHeight();
                    $('.crm-table-wrapper').getNiceScroll().remove();
                    niceScrollInit();
                    return;
                }
            });
        }
    }
    setCheckboxHeight();
    $('.crm-table-wrapper').getNiceScroll().remove();
    niceScrollInit();
}

var inLineEdit = {
    elements : false,

    attributes : {},

    callback_success_after_save : null,

    getType : function (name) {
      return this.elements[name];
    },
    setAjaxKey : function (key) {
        this._ajax_key = key;
        return this
    },
    initKeyUp : function () {

        $(document).keyup(function(e){
            $('.bootstrap-timepicker.open').removeClass('open');
            $('.form-datetime .date').datepicker('hide');

            if(e.which == 27){
                var $lotEdit = $('.lot-edit.editing');

                if (in_lite_lw == null && $('tr.editing').length) {
                    in_lite_lw = $('tr.editing .data_edit:first');
                }

                if ($lotEdit.length) {
                    $lotEdit.remove();
                    LotEdit.status = null;
                    in_lite_lw = null;
                    return;
                }

                if(e.target)
                    InLineSet(e, true, 'cancel');
            } else if (e.keyCode == 13){
                var btnLotEditChange = $('[data-type="lot-edit"] .btn-primary');

                if (btnLotEditChange.length) {
                    btnLotEditChange.trigger('click');
                }

                if(e.target.tagName = 'input'){
                    InLineSet(e, true, 'save');
                }
            }
        });
    },
    loadElements : function(){
        var ajax, _data,
            params_for_data = [],
            block =  $('.list_view_block.sm_extension, .bpm_block.sm_extension');

        if(typeof(block) == 'undefined' || !block) return;

        block.find('table#list-table thead tr th.data_edit').each(function(i, ul){
            var field_name = $(ul).data('name');
            if(typeof(field_name) == 'undefined' || !field_name) return true;
            if (field_name.indexOf(',')>-1) {
              var arr = field_name.split(',');
              $.each(arr, function(key,val){
                params_for_data.push(val);
              });
            } else{
              params_for_data.push(field_name);
            }
        });

        _data = {
            'copy_id' : block.data('copy_id'),
            'pci' : block.data('parent_copy_id'),
            'this_template' : block.data('this_template'),
            'params_for_data' : params_for_data,
        }

        ajax = AjaxObj.createInstance();
        var count = $.inArray(this.key, AjaxContainers.arrayOfKeys);
        if (count>=0 && count < AjaxContainers.arrayOfKeys.length) {
            return;
        }

        AjaxContainers.addInstance(this._ajax_key, ajax);
        ajax
            .setUrl('/module/listView/loadInlineElements/' + _data.copy_id)
            .setData(_data)
            .setType('POST')
            .setDataType('json')
            .setAsync(true)
            .setCallBackSuccess(function(data){
                if(data.status && data.elements){
                    inLineEdit.elements = data.elements;
                    ListView.createLinkByLV();
                } else if(!data.status){
                    inLineEdit.elements = false;
                }
            })
            .send();
    },

    removeClassEditing : function(obj){
        var $row =  $(obj).find('tbody tr.editing').removeClass('editing');

        ListView
            .createLinkByLV($row)
            .updateSDMField()
            .editLinkreDraw();
    },

    isEditing : function(obj){
        var $obj = obj ? $(obj) : $('.crm-table-wrapper');

        return ($obj.find('tbody tr.editing').length) ? true : false;
    },

    getFieldName : function(obj){
        var field_name = $(obj).closest('table').find('thead th').eq($(obj).index()).data('name');
        if(field_name != 'undefined') return field_name;
    },
    getGroupIndex : function(obj){
        var group_index = $(obj).closest('table').find('thead th').eq($(obj).index()).data('group_index');
        if(typeof(group_index) != 'undefined') return group_index;
    },
    getHtmlElement : function(obj, td, element_name, callback){
            if(!inLineEdit.elements){
                callback(false);
                return;
            }
            var element = inLineEdit.elements[element_name];
            var value = null;

            if(!element) {
                callback(false);
                return;
            }

            switch(element.type){
                case 'string':
                case 'numeric':
                case 'display':
                case 'relate_string':
                        value = td.find('.element_data[data-name="'+element_name+'"]').data('value')
                        element.element = $(element.element).val(value);
                        inLineEdit.attributes[element_name] = value;
                        textAreaResize();
                        callback(element.element);
                        break;
                case 'datetime':
                        var dom = $(element.element);
                        var $element = td.find('.element_data[data-name="'+element_name+'"]');

                        if ($element.data('all_day') != undefined) {
                            var date = $element.data('value_date'),
                                $new_element = dom.find('.date-time'),
                                all_day = parseInt($element.data('all_day'));

                            if (!all_day) {
                                date += ' ' + $element.data('value_time');
                            }

                            $new_element
                                .data('all_day', $element.data('all_day'))
                                .attr('data-all_day', $element.data('all_day'));

                            $new_element.val(date);

                            inLineEdit.attributes[element_name] = date;

                        } else {
                            value = {
                                'date' : td.find('.element_data[data-name="'+element_name+'"]').data('value_date'),
                                'time' : td.find('.element_data[data-name="'+element_name+'"]').data('value_time')
                            };

                            dom.find('.date').val(value['date']);
                            dom.find('.time').val(value['time']);
                            inLineEdit.attributes[element_name] = value;
                        }

                        callback(dom);
                        initElements('.list-view-panel', dom.find('.time').val());
                        break;
                case 'select':
                case 'logical':
                case 'permission':
                case 'display_block':
                        var dom = $(element.element);
                        value = td.find('.element_data[data-name="'+element_name+'"]').data('value');
                        dom.val(value);
                        dom.find('.select').selectpicker({ style: 'btn-white', noneSelectedText: Message.translate_local('None selected')});
                        inLineEdit.attributes[element_name] = value;
                        inLineEdit.attributes[element_name+'_text'] = td.text();
                        callback(dom);
                        $('.select').selectpicker({ style: 'btn-white', noneSelectedText: Message.translate_local('None selected')});
                        break;
                case 'access':
                        value = td.find('.element_data[data-name="'+element_name+'"]').data('value');
                        element.element = $(element.element).val(value);
                        element.element = $(element.element).data('type', td.find('.element_data[data-name="'+element_name+'"]').data('type'));
                        element.element.find('.select').selectpicker({ style: 'btn-white', noneSelectedText: Message.translate_local('None selected')});
                        inLineEdit.attributes[element_name] = value;
                        callback(element.element);
                        $('.select').selectpicker({ style: 'btn-white', noneSelectedText: Message.translate_local('None selected')});
                        break;
                case 'relate':
                case 'relate_this':
                case 'module':
                case 'module_public':
                        var dom = $(element.element);
                        var element_data = td.find('.element_data[data-name="'+element_name+'"]');
                        value = {
                            'id' : element_data.data('id'),
                            'copy_id' : element_data.data('relate_copy_id')
                        };
                        dom.find('button').data('id', value.id)
                                          .data('relate_copy_id', value.copy_id)
                                          .html(element_data.find('span').html());
                        inLineEdit.attributes[element_name] = value;
                        callback(dom);
                        break;
                case 'relate_dinamic':
                    var dom = $(element.element);
                    var element_data = td.find('.element_data[data-name="'+element_name+'"]');
                    value = {
                        'id' : element_data.data('id'),
                        'copy_id' : element_data.data('relate_copy_id')
                    };

                    var relate_copy_id = value.copy_id;

                    dom
                        .find('.element[data-type="drop_down_button"]').data('id', value.id)
                        .data('relate_copy_id', relate_copy_id)
                        .html(element_data.find('span').html());
                    dom
                        .find('.element[data-type="drop_down_list"]')
                        .data('relate_copy_id', relate_copy_id);

                    inLineEdit.attributes[element_name] = value;

                    callback(dom);
                    break;
                case 'relate_participant':
                        var dom = $(element.element);
                        var element_data = td.find('.element_data[data-name="'+element_name+'"]');
                        dom.find('button').data('participant_id', element_data.data('participant_id'))
                                          .data('ug_id', element_data.data('ug_id'))
                                          .data('ug_type', element_data.data('ug_type'))
                                          .html(element_data.find('span').html());

                        inLineEdit.attributes[element_name] = element_data.data('participant_id');

                        callback(dom);
                        break;
                case 'file':
                        var dom = $(element.element);
                        var element_data = td.find('.element_data[data-name="'+element_name+'"]');
                        if(element_data.data('id')){
                            dom.find('.upload-result').show();
                            dom.find('.upload_link').hide();
                            dom.find('.thumb-block').hide();
                            dom.find('.file_thumb').css('display', 'inline-block')
                                                   .removeClass()
                                                   .addClass('file_thumb ' + element_data.data('file_type_class'))
                                                   .text(element_data.data('file_type'));
                            dom.find('.filedate').text(element_data.data('dateupload'));
                            dom.find('.upload_file').val(element_data.data('id'));
                            dom.find('.file-download').attr('href', element_data.data('href'));
                            dom.find('.filename').text(element_data.data('title'));
                        }

                        inLineEdit.attributes[element_name] = element_data.data('id');

                        callback(dom);
                        break;
                case 'file_image':
                        var dom = $(element.element);
                        var element_data = td.find('.element_data[data-name="'+element_name+'"]');
                    if(element_data.data('id')){
                            dom.find('.upload-result').show();
                            dom.find('.upload_link').hide();
                            dom.find('.image-preview').attr('href', element_data.data('download-link'))
                                                      .attr('title', element_data.data('title'))
                                                      .data('id', element_data.data('id'))
                                                      .data('dateupload', element_data.data('dateupload'))
                                                      .data('filesize', element_data.data('filesize'))
                                                      .data('download-link', element_data.data('download-link'));
                            dom.find('.file_thumb').hide();
                            dom.find('.thumb-block').css('display', 'inline-block').find('.thumb')
                                                                .prop('src', element_data.data('href'))
                                                                .prop('title', element_data.data('title'));

                            dom.find('.filedate').text(element_data.data('dateupload'));
                            dom.find('.upload_file').val(element_data.data('id'));
                            dom.find('.file-download').attr('href', element_data.data('download-link'));
                            dom.find('.filename').text(element_data.data('title'));
                        }

                        inLineEdit.attributes[element_name] = element_data.data('id');

                        callback(dom);
                        imagePreview();
                        break;
            }
    },
    
    // перегружаем списки в relate полях
    reloadRelate : function(obj){
        var parent = $(obj).closest('.sm_extension_data.editing').find('.data_edit .element_relate[data-reloader="parent"]');
        if(!parent.length){
            var el = $(obj).closest('.sm_extension_data.editing').find('.element_relate[data-module_parent="1"]');
            if(el && el.data('module_parent')){
                el = el.next().find('.sm_extension_data[data-id="'+el.data('id')+'"]');
                if(el){
                    TodoList.rebuild(el);
                }
            }
        }
        
        var data = {};

        EditView.relateDataStory.setAll(obj);
        data['copy_id'] = $(obj).closest('.sm_extension').data('copy_id');
        data['id'] = $(obj).closest('.sm_extension_data.editing').data('id');
        data['primary_entities'] = {'primary_pci' : parent.data('relate_copy_id'), 'primary_pdi' : parent.data('id')};
        data['parent_relate_data_list'] = EditView.relateDataStory.findRelateDataListFromInLine(obj);
        data['relate_get_value'] = 1;
        data['this_template'] = $('.list_view_block.sm_extension, .process_view_block.sm_extension').data('this_template');
        data['pci'] = $('.list_view_block.sm_extension, .process_view_block.sm_extension').data('parent_copy_id');
        data['pdi'] = $('.list_view_block.sm_extension, .process_view_block.sm_extension').data('parent_data_id');

        if(data['pci'] && data['pdi']){ // запретить изменение родительского модуля когда мы вошли через него
            parent.prop('disabled', 'true');
        }


        EditView.relates.reloadInLine(obj, data, null, false, function () {
            $('tr.editing').data('open', false);
        });
    },
    
    //редактируем строку
    edit : function(obj){
        var $row,
            $files,
            $element = $(obj);

        if(!inLineEdit.elements){
            return;
        }

        inLineEdit.attributes = {};

        if ($element.is('.lot-edit')) {
            instanceLotEdit.remove();
        }

        $row = $element.closest('tr');
        $row.find('.element_data ').each(function(i, ul){
            if($(ul).data('disabled')){
                $(ul).closest('td.data_edit').removeClass('data_edit');
            }
        });

        $element.closest('tr').data('open', true);

        $.each($element.closest('table').find('thead > tr > th'), function(i, ul){
            var th_index = $(ul).index();

            if(!$(ul).hasClass('data_edit')){
                return true;
            }

            if($(ul).data('name')){
                 var names = $(ul).data('name').split(","),
                     row = $element.closest('tr'),
                     td = $(row).children('td').eq(th_index),
                     td_html = td.clone(),
                     add = 0;

                 if(!td.hasClass('data_edit')){
                     return true;
                 }

                 inLineEdit.removeClassEditing($element.closest('#list-table'));
                 row.addClass('editing').removeClass('pre-editing');

                 $(names).each(function(key, field_name){
                    inLineEdit.getHtmlElement(obj, td_html, field_name, function(data){
                        if(data){
                            if(!add++){
                                td.html('');
                            }
                            td.append(data);
                        }
                    });
                 });

            }
        });

        if (!$element.is('.lot-edit')) {
            inLineEdit.reloadRelate(obj);
        }

        $files = $('tr.editing td');
        $.each($files, function () {
            var $this = $(this);

            if ($this.find('.form-datetime').length) {
                $this.addClass('content-wrap');
            }

            if ($this.find('.upload-result').length) {
                if ($this.find('.upload-result[style*="display: block"]').length) {
                    $this.addClass('content-image');
                    $this.find('.upload_link').addClass('hide');
                } else {
                    $this.find('.upload_link').removeClass('hide');
                }
            }
        });

        var _this_dinamic = $($element.closest('.sm_extension_data').find('.element[data-type="drop_down_button"][data-sub_type="dinamic"]').closest('.element[data-type="drop_down"]'));
        if(_this_dinamic){
            var drop_down_list = new DropDownList();

            drop_down_list
                .setGroupData(DropDownListObj.GROUP_DATA_SDM_OPTION_LIST)
                .loadFromServer(drop_down_list.getDataForNextOptionList(_this_dinamic, true), function(data){
                    if(data.status == true){
                        $(_this_dinamic).find('.element[data-type="drop_down_list"] .submodule-table tbody').html(data.html_option);
                    }
                });
        }

        var _drop_down_module = $($element.closest('.sm_extension_data').find('.element[data-type="drop_down_button"].element_module').closest('.element[data-type="drop_down"]'));
        if(_drop_down_module.length){
            _data = {
                'data_id' : $element.closest('.sm_extension_data').data('id'),
                'this_template' : $element.closest('.list_view_block').data('this_template')
            }

            ajax = AjaxObj.createInstance();

            ajax
                .setUrl('/module/listView/inlineCheckDisableElement/' + $element.closest('.list_view_block').data('copy_id'))
                .setData(_data)
                .setType('POST')
                .setDataType('json')
                .setAsync(true)
                .setCallBackSuccess(function(data){
                    if(data.status){
                        _drop_down_module.find('.element[data-type="drop_down_button"]').addClass('disabled');
                    } else {
                        _drop_down_module.find('.element[data-type="drop_down_button"]').removeClass('disabled');
                    }
                })
                .send();
        }

        Global.initSelects();

        ListView.editLinkreDraw();
        setCheckboxHeight();

        instanceInlineEdit = new InlineEdit();

        var model,
            lv = ListView.getInstance();

        if (lv) {
            model = lv.getModel();

            if (model) {
                model.showReadOnlyFields($element.closest('tr'));
            }
        }

        niceScrollCreate($('.submodule-table'));
        var time = setTimeout(function () {
            clearTimeout(time);
            Global.addOperationInSDM();
        }, 150);
    },
    //добавляем новую строку
    add : function(zeroRow){
        if(!inLineEdit.elements) return;

        var tr, td,
            table = $('table.crm-table');

        tr = table.find('tbody tr').first().clone();
        tr.data('id', '');

        td = tr.find('td');
        
        in_lite_lw = td;
        td.each(function(i, ul){
            if(i == 0) return true;
            tr.find('td:eq('+i+')').empty();
        });

        table.find('tbody').prepend(tr);
        inLineEdit.edit(tr);

        if (!instanceLotEdit) {
            instanceLotEdit = new LotEdit();

            tr.removeClass('lot-edit').show();
            table.find('tbody').prepend(tr);
            inLineEdit.edit(table.find('tbody tr:first td').first());
        }

        niceScrollCreate($('.submodule-table'));

        if (zeroRow) {
            tr.addClass('lot-edit').find('.checkbox').remove();
            tr.find('td:first').html('<a href="javascript:void(0)" class="refresh"><i class=" fa fa-refresh"></i></a>');
            $('.lot-edit [data-type="file"]').empty();
            $('.lot-edit [data-type="file_image"]').empty();

            niceScroll.update($('#list-table_wrapper'));

            instanceLotEdit.init();
            setCheckboxHeight();
        }
    },
    append : function(obj, element_data, id){
        var td, group_index;

        $(obj).find('td.data_edit').each(function(i, ul){
            td = $(ul);

            group_index = inLineEdit.getGroupIndex(td);
            if(typeof(group_index) != 'undefined'){
                $(td).html(element_data[group_index]);
            }
            if(id){
                obj.data('id', id);
            }
        });
        imagePreview();
        userSingleLink();
        poliDot();
    },

    getData: function(obj){
        var obj_data, td;
        var _data = {};
        var _data_relate = [];
        var _data_element_responsible = [];

        if(!inLineEdit.elements) return _data;

        var td_editting = '';
        if($(obj).hasClass('lot-edit')){
            td_editting = '.editing';
        }

        $(obj).closest('table').find('tbody').find('tr.editing').find('td.data_edit'+td_editting).each(function(i, ul){
            td = $(ul);
            var names = inLineEdit.getFieldName(td)+'';
            if(names && names != 'undefined'){
                names = names.split(",");

                $(names).each(function(key, field_name){
                    var field = inLineEdit.elements[field_name];
                    if (!field) {
                      return false;
                    }
                    if(field_name && field['type']!= undefined){
                        switch(inLineEdit.elements[field_name]['type']){
                            case 'string':
                            case 'numeric':
                            case 'display':
                            case 'relate_string':
                                obj_data = $(td).find('input[type="text"][name="EditViewModel['+field_name+']"], textarea[name="EditViewModel['+field_name+']"]');
                                _data[obj_data.attr('name')] = obj_data.val();
                                break;
                            case 'datetime':
                                obj_date = $(td).find('input.date-time[name="EditViewModel['+field_name+']"]');

                                if(obj_date.data('all_day') != undefined){
                                    _data[obj_date.attr('name')] = {
                                        'date_time' : obj_date.val(),
                                        'all_day' : obj_date.data('all_day')
                                    };
                                } else {
                                    var obj_date = $(td).find('input.date[name="EditViewModel['+field_name+']"]');
                                    var obj_time = $(td).find('input.time[name="EditViewModel['+field_name+']"]');

                                    if(obj_date+obj_time){
                                        _data[obj_date.attr('name')] = obj_date.val() + ' ' + obj_time.val();
                                    }
                                }
                                break;

                            case 'logical':
                            case 'select':
                            case 'permission':
                            case 'display_block':
                                obj_data = $(td).find('select[name="EditViewModel['+field_name+']"]');
                                _data[obj_data.attr('name')] = obj_data.val();
                                break;

                            case 'access':
                                obj_data = $(td).find('select[name="EditViewModel['+field_name+']"]');
                                _data[obj_data.attr('name')] = {'id' : obj_data.val(), 'type' : obj_data.find('option[value="'+obj_data.val()+'"]').data('type')} ;
                                break;

                            case 'file':
                            case 'file_image':
                                var obj_box = $(td).find('.file-box[data-name="EditViewModel['+field_name+']"]');
                                var _files = [];
                                obj_box.find('input.upload_file').each(function(i, ul){
                                    if($(ul).val()) _files.push($(ul).val());
                                });

                                if($.isEmptyObject(_files)){
                                    _files = '';
                                }
                                _data[obj_box.data('name')] = _files;
                                break;

                            case 'module':
                            case 'module_public':
                                obj_data = $(td).find('button[name="EditViewModel['+field_name+']"]');
                                _data[obj_data.attr('name')] = obj_data.data('id');
                                break;
                            case  'relate':
                            case  'relate_dinamic':
                                var obj_box = $(td).find('button[name="EditViewModel['+field_name+']"]');
                                _data_relate.push({
                                    'name' : obj_box.attr('name'),
                                    'relate_copy_id' :  obj_box.data('relate_copy_id'),
                                    'id': obj_box.data('id'),
                                })
                                break;

                            case  'relate_this':
                                var obj_box = $(td).find('button[name="EditViewModel['+field_name+']"]');
                                _data[obj_box.attr('name')] = obj_box.data('id');
                                break;
                            case  'relate_participant':
                                var obj_box = $(td).find('button[name="EditViewModel['+field_name+']"]');
                                _data_element_responsible.push({
                                    'name' : obj_box.attr('name'),
                                    'participant_id': obj_box.data('participant_id'),
                                    'ug_id': obj_box.data('ug_id'),
                                    'ug_type': obj_box.data('ug_type'),
                                    'responsible': '1'
                                })
                                break;
                        }
                    }
                });
            }
        });

        _data['element_relate'] = _data_relate;
        _data['element_responsible'] = _data_element_responsible;

        return _data;
    },

    getIdList : function(obj){
        if($(obj).hasClass('lot-edit')){
            var input_checked_list = $('.list_view_block #list-table tbody .sm_extension_data td .visible-cell input[type="checkbox"]:checked');
            if(!input_checked_list.length){
                return;
            }

            var id_list = [];

            input_checked_list.each(function(i, ul){
                id_list.push($(ul).closest('.sm_extension_data').data('id'));
            })

            return id_list;
        } else {
            return [$(obj).data('id')];
        }
    },

    setCallbackSuccessAfterSave : function(callback){
        inLineEdit.callback_success_after_save = callback;
    },

    save : function(obj, callback){
        if(!inLineEdit.elements){
            return callback({'status' : false})
        }

        var _data = inLineEdit.getData(obj);

        _data['id_list'] = inLineEdit.getIdList(obj);
        _data['parent_copy_id'] = $(obj).closest('.sm_extension').data('parent_copy_id');
        _data['parent_data_id'] = $(obj).closest('.sm_extension').data('parent_data_id');
        _data['lot_edit'] = 0;

        if($(obj).hasClass('lot-edit')){
            _data['lot_edit'] = 1;
        }

        var parent = $(obj).closest('.sm_extension_data.editing').find('.data_edit .element_relate[data-reloader="parent"]');
        if(parent.length){
            _data['primary_entities'] = {'primary_pci' : parent.data('relate_copy_id'), 'primary_pdi' : parent.data('id')};
        } else {
            _data['primary_entities'] = {'primary_pci' : $('.sm_extension').data('copy_id'), 'primary_pdi' : ''};
        }

        $.ajax({
            url : Global.urls.url_in_line_save +'/'+ $(obj).closest('.sm_extension').data('copy_id'),
            data : _data,
            type : 'POST', async: false, dataType: "json",
            success: function(data){
                if(data.status == 'save'){
                    if($(obj).hasClass('lot-edit') == false){
                        inLineEdit.append(obj, data.element_data, data.id)

                        if(data.content_reload_vars){
                            instanceGlobal.contentReload.setVarsFromPage(data.content_reload_vars);
                        }
                    }

                    if(typeof inLineEdit.callback_success_after_save == 'function'){
                        inLineEdit.callback_success_after_save();
                    }
                    callback({'status' : true});
                    QuickViewPanel.updateContent();
                    AjaxContainers.cash.snapshot();
                } else {
                    if(data.status == 'error_save'){
                        Message.show(data.messages, false);
                        callback({'status' : false});
                    } else {
                        if(data.status == 'error'){
                            Message.show(data.messages, false);
                            callback({'status' : false});
                        } else  if(data.status == 'access_error'){
                            Message.show(data.messages, false);
                            callback({'status' : false});
                        }
                    }
                }
                instanceInlineEdit.removePreEditing();
            },
            error : function(xhr){
                if (xhr.status) {
                    Message.show([{'type': 'error', 'message': Global.urls.url_ajax_error}], true);
                }

                return callback({'status' : false})
            }
        });
    },
    cancel : function(obj, callback){
        var $row = $(obj);

        if(!$row.data('id')) {
            inLineEdit.removeClassEditing($row.closest('table'));
            $row.remove();
            in_lite_lw = null;
            return;
        }

        instanceInlineEdit && instanceInlineEdit.remove();

        this.destroy();

        var time = setTimeout(function () {
            clearTimeout(time);
            $.ajax({
                url : Global.urls.url_in_line_cancel +'/'+$row.closest('.sm_extension').data('copy_id'),
                data : {'id' : $row.data('id')},
                type : 'POST', async: false, dataType: "json",
                success: function(data){
                    var json;

                    if(data.status == true){
                        inLineEdit.append(obj, data.element_data)
                        inLineEdit.removeClassEditing($row.closest('#list-table'));
                        if(data.content_reload_vars) {
                            instanceGlobal.contentReload.setVarsFromPage(data.content_reload_vars);
                        }
                        json = {'status' : true}
                    } else if(data.status == false){
                        Message.show(data.messages, false);
                        json = {'status' : false}
                    }

                    if ($.isFunction(callback)) {
                        callback(json);
                    }
                },
                error : function(){
                    Message.show([{'type':'error', 'message': Global.urls.url_ajax_error}], true);
                }
            });
        }, 50);
    },
    destroy: function () {
        Events.removeHandler(Events.TYPE_EVENT_SCROLL, 'datetime');
    }
};

var instanceInlineEdit = null;
var InlineEdit = function () {
    var $controls = $('.form-control');

    this.propertyOriginCss = $controls.css('border')
    $controls.css('border-color', 'rgba(150, 160, 180, 0.3)');
    this.events();
    $(document).on('keyup', '.editing input[type="text"]', this.onKeyUpInput);
}
InlineEdit.prototype = Object.create(_Global.prototype);
InlineEdit.prototype.events = function () {
    this._events = [
        { parent: document, selector: '#container', event: 'click', func: this.onClickOutSide}
    ]

    Global.addEvents(this._events, {
        instance: this
    });
};

InlineEdit.prototype.onClickOutSide = function (e) {
    var $target = $(e.target);

    if ($target.is('.list_view_btn-bulk_edit')
        || $target.is('.checkbox')
        || $target.closest('.editing').length) return;

    var statusOperation = instanceLotEdit && instanceLotEdit.status ? true : false;

    InLineSet(e, statusOperation, 'save');
};
InlineEdit.prototype.removePreEditing = function () {
    $('.pre-editing').removeClass('pre-editing');
    setCheckboxHeight();
}
InlineEdit.prototype.remove = function () {
    $('.form-control').css('border-color', this.propertyOriginCss)
}
InlineEdit.prototype.onKeyUpInput = function (e) {
    var element,
        $this = $(this),
        name = $this.attr('name');

    if (name) {
        element = inLineEdit.getType(name.substring(name.indexOf('[')+1, name.length-1));
    }

    if ($this.closest('.lot-edit').length) {
        if (e.keyCode == 13) { instanceLotEdit.save(); }
        return
    }

    if (element && element.type == 'numeric' && !Number($this.val())) {
        $this.val($this.val().replace(/[a-z]|[а-я]/igm,''));
    }
}

$(function() {

    inLineEdit.initKeyUp();

    // $(document).on('click', '#list-table > tbody > tr > td', function(e){
    //     var $target = $(e.target);
    //
    //     if(!$target.hasClass('data_edit') || $target.data('exit') || $target.closest('tr').is('.lot-edit')) {
    //         $target.removeData('exit');
    //         return;
    //     }
    //
    //     var trLotEdit = $('.lot-edit.editing'),
    //         _this = this;
    //
    //     if (trLotEdit.length) {
    //         trLotEdit.hide();
    //         trLotEdit.find('input[type="text"]').removeClass('color-red').removeClass('color-green'); // TODO: delete class colors
    //         $('[type="checkbox"]').prop('checked', false);
    //         inLineEdit.removeClassEditing($('#list-table'));
    //     };
    //
    //     in_lite_lw = _this;
    //     // если редактируем строку
    //     if(inLineEdit.isEditing($(_this).closest('#list-table')) == true){
    //         inLineEdit.save($(_this).closest('tbody').children('tbody > tr.editing'), function(data){
    //             if(data.status == true){
    //                 if($(_this).closest('tr.editing').length == 0){
    //                     inLineEdit.edit(_this);
    //                 } else{
    //                     inLineEdit.removeClassEditing($(_this).closest('#list-table'));
    //                 }
    //             }
    //         });
    //     } else {
    //         inLineEdit.edit(_this);
    //     }
    //
    //     setCheckboxHeight();
    //     $('.crm-table-wrapper').getNiceScroll().remove();
    //     niceScrollInit();
    // });

    $(document).on('click', '#list-table > tbody > tr > td.data_edit > span:not(.list-view-avatar)', function(e){
        $(this).closest('td').trigger('click');
        e.stopPropagation();
    });

    $(document).on('click', '.data_edit .dropdown-toggle, .toggle-right-box', function() {
        dropDownPosition($(this));
    });

    $('document').on('hover','.crm-table-wrapper .dropdown.open>.dropdown-menu', function() {
        $(window).on('mousewheel', function(e) {
            e.preventDefault();
        });
    },function(){
        $(window).off('mousewheel');
    });

    $(window).on('scroll', function() {
        $('.crm-table-wrapper .dropdown.open, .crm-table-wrapper .select.open').removeClass('open');
    });

    $('.crm-table-wrapper').on('scroll', function() {
        $('.crm-table-wrapper .dropdown.open, .crm-table-wrapper .select.open').removeClass('open');
        $('.datepicker-orient-left, .bootstrap-timepicker.open').hide();
    });

    $(document).on('click', '.inline_dnt-add', function(e){
        // если редактируем строку
        if(inLineEdit.isEditing($('#list-table'))){
            inLineEdit.save($('table.crm-table tr:eq(1)'), function(data){
                if(data.status == true){
                    inLineEdit.removeClassEditing($(in_lite_lw).closest('#list-table'));
                    in_lite_lw = null;
                    inLineEdit.add();
                }
            });

        } else {
            inLineEdit.add();
        }
        setCheckboxHeight();
        $('.crm-table-wrapper').getNiceScroll().remove();
        niceScrollInit();
    });

});



