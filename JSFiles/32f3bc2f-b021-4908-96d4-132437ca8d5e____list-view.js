/**
 * checkbox height dummycode and niceScroll reinit
 */

;(function (exports) {
    var _private, _public, ModelListView,
        _self = {};

    ModelListView = {
        type: 'list-view',
        instance: null,
        setInstance: function (instance) {
            this.instance = instance;

            return this;
        },
        removeItem: function (e) {
            var $target = $(e.target),
                _this = this,
                _data = [];

            if($('.sm_extension_data input:checked').length == 0){
                Message.show([{'type':'error', 'message': 'It should be noted entries'}], true);
                return;
            }

            var _function = function(){
                $('.sm_extension_data input:checked').each(function(i, ul){
                    _data.push($(ul).closest('.sm_extension_data').data('id'));
                });

                _data = {
                    'id': _data,
                    'this_template': $target.closest('.list_view_block.sm_extension, .process_view_block.sm_extension').data('this_template'),
                }

                Global.getModel().removeData({
                    copy_id: $target.closest('.sm_extension').data('copy_id'),
                    data: _data
                },
                    function (data) {
                        if(data.status){
                            if(!data.messages){
                                instanceGlobal.contentReload
                                    .prepareVariablesToGeneralContent()
                                    .run();
                            } else {
                                Message.show(data.messages, false, function(){
                                    instanceGlobal.contentReload
                                        .prepareVariablesToGeneralContent()
                                        .run();
                                });
                            }
                        } else {
                            Message.show(data.messages, false);
                        }

                        HeaderNotice.refreshAllHeaderNotices();
                        QuickViewPanel.updateContent();
                    }
                )
            }

            Message
                .createInstance()
                .setHandlerAsConfirmAgree(function () {
                    modalDialog.hide();
                    _this.instance.showPreloader(true);

                    var time = setTimeout(function() {
                        clearTimeout(time);
                        _function();
                    }, 100);
                })
                .show([{'type':'confirm', 'message': Message.translate_local('Delete selected entries') + '?'}], false, null, Message.TYPE_DIALOG_CONFIRM);
        },
        copyItem: function(e){
            var $target = $(e.target),
                _this = this,
                params = [];

            if($('.sm_extension_data input:checked').length == 0){
                Message.show([{'type':'error', 'message': 'It should be noted entries'}], true);
                return;
            } else {
                $('.sm_extension_data input:checked').each(function(i, ul){
                    params.push($(ul).closest('.sm_extension_data').data('id'));
                });
            }

            this.instance.getPreloader().show();

            params = {
                'id' : params,
                'pci' : $('.list_view_block.sm_extension, .process_view_block.sm_extension').data('parent_copy_id'),
                'pdi' : $('.list_view_block.sm_extension, .process_view_block.sm_extension').data('parent_data_id'),
                'this_template' : $('.list_view_block.sm_extension, .process_view_block.sm_extension').data('this_template'),
            }

            Global.getModel().copyData({
                copy_id: $target.closest('.sm_extension').data('copy_id'),
                data: params
            }, function (data) {
                    if(data.status){
                        var instanceContent = ContentReload.createInstance();

                        iPreloader.implements.call(instanceContent);
                        Global.getInstance().setContentReloadInstance(instanceContent); // подовження роботи

                        instanceContent
                            .reDefinition()
                            .setPreloader(_this.instance.getPreloader())
                            .prepareVariablesToGeneralContent()
                            .run();
                    } else {
                        Message.show(data.messages, false);
                    }
            });
        },
        getItem: function() {
            return $('.list_view_block');
        }
    };

    var TableResize = {
        sync: function ($table) {
            //instance LV
            var $list;

            if ($table) {
                $list = $table.find('thead th');
            }

            var $ripList = $('.JCLRgrips .JCLRgrip');

            $list.filter(function (index) {
                var $item = $list.eq(index);
                var dgi = $item.attr('data-group_index');
                var $ripItem = $ripList.eq(index);

                if ($item.css('display') == 'none') {
                    $ripItem.hide();
                } else {
                    $ripItem.show();
                }

                $ripItem
                    .data('group_index', dgi)
                    .attr('group_index', dgi);
            });


            console.log('colResize sync');
        },
        send: function () {

        }
    }

    _private = {
        data_name_object: 'ModelListView',

        onClickAddCard : function() {
            Global.getInstance().addCard(this, null, null);
        },
        onFileRemove : function(){
            var _this = this,
                $this = $(this),
                activity = $this.closest('.file-block[data-type="activity"]');

            if(activity.length > 0) return;

            Global.Files.fileDelete($this.closest('.file-block').find('.upload_file').val(), false, function(data){
                if(data.status == false){
                    Message.show(data.messages, false);
                } else {
                    var files_block = $this.closest('.files-block'),
                        $container = $this.closest($this.closest('.edit-view').length ? '.file-block' : 'td');

                    $container.removeClass('content-image');
                    $container.find('.upload_link').removeClass('hide');

                    if($(_this).closest('.file-box').find('.column').length > 1){
                        $(_this).closest('.column').empty();
                    } else {
                        var generate_link = $(_this).closest('.upload-result').find('.image-preview').data('parent_id');
                        $(_this).closest('.upload-result').parent().find('.list_view_btn-generate_edit').hide();
                        $(_this).closest('.second-row').removeClass('linkMore2');
                        if(!!generate_link) {
                            $(_this).closest('.upload-result').addClass('generate_only');
                            $(_this).closest('.upload-result').parent().find('.upload_link').show();
                        }else {
                            $(_this).closest('.upload-result')
                                .find('.thumb').attr('src', '').attr('title', '')
                                .end().hide()
                                .parent().find('.upload_file').val('')
                                .parent().find('.upload_link').show();
                        }
                        $(_this).closest('.file-block').find('.errorMessage').text('');
                        $('.list-view-panel .crm-table-wrapper').getNiceScroll().remove();
                        niceScrollInit();
                        setCheckboxHeight();
                    }
                    if (!files_block.find('.file-box .upload-result:visible').length) {
                        files_block.find('.file_is_empty').show();
                    }
                }
            });
        },
        onClickTableCell : function(e){
            if(!inLineEdit.elements){
                return;
            }

            var $target = $(e.target);

            if(!$target.hasClass('data_edit') || $target.data('exit') || $target.closest('tr').is('.lot-edit')
                || instanceLotEdit && instanceLotEdit.status) {
                $target.removeData('exit');
                return true;
            }

            var trLotEdit = $('.lot-edit.editing'),
                _this = this,
                $this = $(_this),
                $row = $target.closest('tr'),
                $editingRow = $this.closest('tbody').find('>tr.editing');

            if (trLotEdit.length) {
                trLotEdit.hide();
                trLotEdit.find('input[type="text"]').removeClass('color-red').removeClass('color-green'); // TODO: delete class colors
                $('[type="checkbox"]').prop('checked', false);
                inLineEdit.removeClassEditing($('#list-table'));
            };

            if (!$this.closest('tr').is('.editing')) {
                $row.addClass('pre-editing');
            }

            in_lite_lw = _this;
            // если редактируем строку
            if(inLineEdit.isEditing($this.closest('#list-table')) == true){
                inLineEdit.save($editingRow, function(data){
                    if(data.status == true){
                        if($this.closest('tr.editing').length == 0){
                            inLineEdit.edit(_this);
                        } else{
                            inLineEdit.removeClassEditing($this.closest('#list-table'));
                        }
                    }
                });
            } else {
                inLineEdit.edit(_this);
            }

            setCheckboxHeight($this.closest('tr'));
            niceScroll.clear();
            niceScrollInit();
        },
        onClickTableLink : function (e) {
            $(e.target).closest('td').data('exit', true);
        },
        onRemoveItem: function (e) {
            var instance = e.data.instance;
            instance.getModel().removeItem(e);
        },
        onCopyItem: function (e) {
            var instance = e.data.instance;
            instance
                .getModel()
                .setInstance(instance)
                .copyItem(e);
        }
};

    _public = {
        _interface: 'ListView',
        _instance: null,

        reDefinition: function () {
            var _this = this;

            this.search.apply = function () {
                var url = this.getFullUrl(),
                    contentInstance = ContentReload.createInstance();

                iPreloader.implements.call(contentInstance);

                Global.getInstance().setContentReloadInstance(contentInstance);

                contentInstance
                    .reDefinition()
                    .clear()
                    .setPreloader(_this.preloader)
                    .prepareVariablesToGeneralContent()
                    .setUrl(url)
                    .run();
            };
            this.search.showPreloader = function () {
                _this.showPreloaderTemplate.call(_this.preloader);
                return this;
            };

            this.afterLoadView = function () {
                $('#container').removeClass('hide-nice-scroll');

                ViewType.afterLoadView();

                return this;
            }

            return this;
        },
        constructor: function () {
            var _this = this;

            iModule.implements.call(this);
            iPreloader.implements.call(this);

            this.createModel();

            this.events()
                .allMethod()
                .styling()
                .scrollOfHorizontale();

            this.setPreloader(Preloader.createInstance());

            this.showPreloaderTemplate = function () {
                NiceScroll.clear($('.list_view_block .crm-table-wrapper'));
                $('body').addClass('hide-edit-view');

                var where = Preloader.POSITION_SPINNER_CONTENT;

                if ($('[data-type="left_menu"]').is(':visible')) {
                    where = Preloader.POSITION_SPINNER_WINDOW;
                }

                this.setRunning(false)
                    .setSpinnerPosition(where)
                    .setElement('body', ['hide-edit-view'])
                    .setAddClass('#container', 'hide-nice-scroll')
                    .setWhereContentHide(Preloader.TYPE_RELOAD_TABLE_CONTENT)
                    // .setCssPositionSpinner(Preloader.css.FIXED)
                    .setPlaceForSpinner($('.list-view-panel .adv-table'))
                    .run();
            };

            this.preloader.showPreloader = this.preloader.show = function () {
                if (!this.isRunning()) {
                    _this.showPreloaderTemplate.call(_this.preloader);
                }
                return this;
            };

            imagePreview();

            return this;
        },
        events : function () {
            this._events = [
                { parent: document, selector: '.file-remove', event: 'click', func: _self.onFileRemove}, // save text by click on "Save"
                { parent: document, selector: '#list-table .data_edit .text a', event: 'click', func: _self.onClickTableLink},
                { parent: document, selector: '#list-table > tbody > tr > td', event: 'click', func: _self.onClickTableCell},
                { parent: document, selector: '.list_view_block .edit_view_dnt-add', event: 'click', func: _self.onClickAddCard},
                { parent: document, selector: '.list_view_btn-delete', event: 'click', func: _self.onRemoveItem},
                { parent: document, selector: '.list_view_btn-copy', event: 'click', func: _self.onCopyItem}
            ];

            this.addEvents(this._events, {
                instance : this
            });

            return this;
        },
        run: function () {
            //Костиль
            var subInstance = Global.getInstance().getSubInstance();
            if (subInstance && subInstance.search) {
                this.search = subInstance.search;
            } else {
                this.search = Search.createInstance();
            }

            this.filter = Filter.createInstance();

            this.reDefinition()
                .setEmits();

            ViewType.init(this);
            return this;
        },
        getItem: function () {

        },
        colResizable: function () {
            // var iteration = [];
            // var $item = this.getModel().getItem();
            // var $table = $item.find(".list-table").addClass('size-table');
            //
            // var onResized = function(e){
            //     var table = $(e.currentTarget); //reference to the resized table
            //     debugger;
            //     iteration = [];
            //     //$table
            // };
            // console.log('colResize Install');
            // var onDrag = function (e) {
            //     iteration.push(e);
            // }
            //
            // $table.colResizable({
            //     liveDrag: true,
            //     resizeMode: 'fit', // 'flex' || 'fit' || 'overflow'
            //     gripInnerHtml: "<div class='grip'></div>",
            //     draggingClass: "dragging",
            //     minWidth: 100,
            //     onDrag: onDrag,
            //     onResize: onResized
            // });
            //
            // TableResize.sync($table);

            return this;
        },
        setEmits: function () {
            var _this = this;

            Events
                .createInstance()
                .setType(Events.TYPE_EVENT_RESIZE)
                .setKey('ListViewResize')
                .setHandler(function () {
                    var instance = Preloader.getInstance();

                    if (!instance || !instance.isRunning()) {
                        _this.changeShadow();
                    }

                    _this.editLinkreDraw();
                    setCheckboxHeight();

                    poliDot();

                    return true;
                })
                .run();

            return this;
        },
        destroy : function () {
            Global.removeEvents(this._events);
            _self._instance = null;
            this.filter = null;
            this.search = null;

            Events.removeHandler({ key: 'ListViewResize', type: Events.TYPE_EVENT_RESIZE});

            return null;
        }
    };

    var ListView = {
        _type: 'ListView',

        getInstance : function(status){
            if (!_self._instance && status) {
                _self._instance = this.createInstance();
            }

            return _self._instance;
        },
        getModel: function () {
            var model = $('.list_view_block').data(_self.data_name_object);

            return model ? model.setInstance(this) : null;
        },
        createModel: function () {
            var model = Object.create(ModelGlobal.protected);

            for(var key in ModelListView) {
                model[key] = ModelListView[key];
            }

            $('.list_view_block').data(_self.data_name_object, model);
            return model;
        },
        createInstance : function(){
            var Obj = function(){
                for(var key in ListView){
                    this[key] = ListView[key];
                }
                for(var key in _public){
                    this[key] = _public[key];
                }
            }

            Obj.prototype = Object.create(Global);

            return _self._instance = new Obj().constructor();
        },
        isVisible : function() {
            return $('.list_view_block').length ? true : false;
        },
        //Конструктор
        constructorReLoad: function () {
            var contentReload,
                instance = Global.getInstance(true);

            contentReload = instance.getContentReloadInstance();
            var object = contentReload || {},
                reloadPage;

            //F5 перегрузка страницы
            if (!Object.keys(object).length) {
                reloadPage = true;
            }

            object.afterLoadView = function () {
                var instance = ListView.createInstance();

                instance
                    .setCopyId(Number(Url.getCopyId(location.pathname)))
                    .run()

                Global.getInstance().setSubInstance(instance);

                ListViewDisplay
                    .setThis(null)
                    .setIndex()
                    .setHiddenGroupIndex(this);

                //instance.colResizable();

                ListView.updateSDMField();
                var $images = $('.image-preview.name .size60px');
                if ($images.length) {
                    $images.on('load', function(){
                        setCheckboxHeight();
                    });
                } else setCheckboxHeight();
            }

            if (reloadPage) {
                object.afterLoadView();
            }


            return this;
        },
        getScrollLeft: function () {
          return $('.list-view-panel .crm-table-wrapper').scrollLeft();
        },

        editLinkreDraw : function () {
            var r,
                $list = $('.list-view-panel .pencil~.lessening');

            $.each($list.first(), function () {
                var $this = $(this),
                    $pencil = $this.prev(),
                    $cell = $this.closest('td');

                r = $cell.width() - 17 - $pencil.width();

            });

            $list.css('max-width', r ? r : '100%');

            return this;
        },
        scrollPulledLeft : function(listTablePos, settingsTablePos) {
            var $table = $('.first-cell-visible');

            if ($table.length ) {
                var tablePos = ($('#list-table').length == 1) ? listTablePos : settingsTablePos,
                    $visibleCell = $table.find('.visible-cell'),
                    offsetLeft = $table.offset().left;

                if ( offsetLeft < tablePos ) {
                    $visibleCell.addClass('with-shadow');
                } else {
                    $visibleCell.removeClass('with-shadow');
                }
            }

            return this;
        },
        allMethod : function () {
            var eventPath;

            if ($('table.crm-table').length) {
                window.tableInterval = setInterval(function () {
                    if (!ListView.getInstance()) {
                        clearInterval(window.tableInterval)
                    } else Global.updateTab()
                }, 100);

                window.generalUpdateTime = setTimeout(function (){
                    clearTimeout(window.generalUpdateTime);
                    if ($('.crm-table-wrapper').length) {
                        shadowEnd();
                    }
                }, 100);
            }

            var data = {
                //copy_id: Url.getId(location.href)
                copy_id: $('.list_view_block.sm_extension').data('copy_id')
            };

            TableColumnResize
                .createInstance()
                .setModel(data);

            /* Drag table columns*/
            $('#list-table').dragtable({
                dragaccept: '.draggable',
                clickDelay: 200,
                persistState: function(table) {
                    ListViewPosition
                        .setThis(table.el)
                        .prepare()
                        .writeLocalStorage();

                    table.el.find('th').each(function(i) {
                        if(this.id != '') {
                            table.sortOrder[this.id] = i;
                        }
                    });
                    if (!$('.reports-det-table').length>0) {
                        setTableOrder(JSON.stringify(table.sortOrder));
                    }
                    $('.dragtable-wrapper').remove();



                },
                restoreState: function(table) {
                    if (!$('.reports-det-table').length>0) {
                        getTableOrder();
                    }
                }
            });

            return this;
        },
        styling : function () {
            this.hasScrollBar();
            this.scrollPulledLeft($('#list-table_wrapper').length ? $('#list-table_wrapper').offset().left : 0, $('#settings-table_wrapper').length ? $('#settings-table_wrapper').offset().left : 0);

            this.nice_scroll = NiceScroll.createInstance(); //.setContainer(this._container);

            this.nice_scroll
                .fullClear()
                .setPosition(true)
                .setElement($('.list_view_block .crm-table-wrapper'))
                .init();

            setCheckboxHeight();

            return this;
        },
        hasScrollBar : function() {
            var $cell = $('.visible-cell');

            if ($('.crm-table').width() > $('.crm-table-wrapper').width()) {
                $cell.addClass('with-shadow');
            } else {
                $cell.removeClass('with-shadow');
            }

            return this;
        },
        scrollOfHorizontale : function () {
            var _this = this;

            $('.crm-table-wrapper').scroll(function(event) {
                event.stopPropagation();
                event.preventDefault();
                _this.scrollPulledLeft($('#list-table_wrapper').length ? $('#list-table_wrapper').offset().left : 0, $('#settings-table_wrapper').length ? $('#settings-table_wrapper').offset().left : 0);
                shadowEnd();
            });

            return this;
        },
        updateSDMField : function () {
            $('.list-view-panel [data-controller="sdm"]').not(":has(.list-view-avatar)").addClass('is-not-avatar');

            return this;
        },
        createLinkByLV: function($list) {
            $list = $list || $('.list-view-panel .crm-table tbody tr');

            $.each($list, function () {
                var _this = $(this),
                    elements = [],
                    field = _this.find('.element_data[data-name]');

                $.each(field,function (key,val) { // Get type of field
                    val = $(val);
                    var object = inLineEdit.getType(val.data('name'));

                    if (object && object['type'] == 'string' && val.data('value')) {
                        elements.push(val);
                    }
                });

                $.each(elements, function(key, val) {
                    if (val.parent().is('a')) {
                        return;
                    }

                    var data = val.closest('.data_edit'),
                        context = val.clone(),
                        reg = /(www\.\w*\.[\w]*)|((htt)\w+[:]\/\/([\w:\/_.?=&%+#A-Z-\[\]+;\,{}]*))/igm,
                        value = val.data('value').toString();

                    if (value.indexOf('http')>-1) {
                        var url = !~value.indexOf('http') ? 'http://'+value : value;
                        value = '<a href='+url+' target="_blank">' + value +'</a>';
                    } else {
                        if (value.indexOf('@') > -1) {
                            value = '<a href="mailto:' + value + '">' + value + '</a>';
                        } else {
                            value = value.replace(reg, function(s){
                                return "<a href='http://" + s + "' target='_blank'>" + s +"</a>";
                            });
                        }
                    }
                    data.find('.text[data-name="'+context.data('name')+'"]').html(value);
                });
            });

            return this;
        },
        changeShadow : function() {
            //тенюшка для таблицы при скроллинге
            var $wrapper = $('.list-view-panel .crm-table-wrapper');

            if ( $wrapper.length && $wrapper.width() < $('.first-cell-visible').width()) {
                var offsetLeft, offsetTop;

                $wrapper.find('.table-shadow').remove()
                $wrapper.append('<div class="table-shadow"></div>');

                offsetLeft = $wrapper.position().left;
                offsetTop = $wrapper.position().top;

                $wrapper.find('.table-shadow').css({
                    'left': offsetLeft + ($wrapper.width() - 2),
                    'top': offsetTop ,
                    'height' : $wrapper.height() - 6
                });
            }  else {
                $wrapper.find('.table-shadow').remove();
            }
        },
        destroy: function () {
            return _self._instance ? _self._instance.destroy() : null;;
        }
    }
    //
    // for(var key in _public) {
    //     ListView[key] = _public[key];
    // }

    for(var key in ListView) {
        _self[key] = ListView[key];
    }

    for(var key in _private) {
        _self[key] = _private[key];
    }

    exports.ListView = ListView;
})(window);


var setCheckboxHeight = function($element) {
    var $header, $list,
        $table = $('.first-cell-visible');

    $list = $element || $table.find('tbody tr');

    $.each($list, function() {
        var $this = $(this),
            offset = 0,
            offsetHeight = 1,
            maxHeight = $this.height(),
            margins = Math.round(maxHeight / 2),
            $checkbox = $this.find('.visible-cell');

        if ($this.is('.editing')) {
            offset = 1;
            offsetHeight = -1;
        };

        $checkbox
            .css({
                height: maxHeight + offsetHeight,
                'margin-top': -margins + offset,
                'z-index': 1
            })
            .find('.checkbox').css('margin-top', margins - 10);

        if ($this.hasClass('editing')) {
            var remainder = maxHeight % 2,
                trPrev = $this.closest('table').find('tr.sm_extension_data').eq($this.index()).prev();

            if (trPrev.length) {
                trPrev.find('td:first span.visible-cell').css('height', trPrev.height()+1);
            }

            if (remainder) {
                margins = Math.round((maxHeight-1) / 2);
                $checkbox.css({
                    height: maxHeight-1,
                    'margin-top': -margins,
                    'z-index': 1
                })
            }
        }
    });
    $table.find('input[type="checkbox"]').prop('disabled', false);

    $header = $table.find('thead th');
    $header.first().find('span.visible-cell').css({
        height: $header.parent().height()+1,
        'margin-top': Math.floor(-$header.parent().height()/2),
        'z-index': 1
    });


    if ($('.crm-table-wrapper img[src*="size=60"]').length && !setCheckboxHeight._not_repeat) {
        var time = setTimeout(function () {
            clearTimeout(time);
            setCheckboxHeight._not_repeat = true;
            setCheckboxHeight();
        }, 150);
    }
    delete setCheckboxHeight._not_repeat;
};

/*=======================================================
=            Table sorting with localstorage            =
=======================================================*/

var setTableOrder = function(value) {
    var tableId = $('.list_view_block').data('copy_id');
    writeStorage('columnOrder-' + tableId, value);
};

var getTableOrder = function() {
    var tableId = $('.list_view_block').data('copy_id');
    return eval('(' + readStorage('columnOrder-' + tableId) + ')');
};

// using on saving and deleting module
var removeTableOrder = function(tableId) {
    removeStorage('columnOrder-' + tableId);
};

/*-----  End of Table sorting with localstorage  ------*/


$(document).ready(function() {
    var eventPath;

    eventPath = '.table-dropdown li input';
    $(document).off('click', eventPath).on('click', eventPath, function(){
        ListViewDisplay
            .setThis(this)
            .setIndex()
            .setHiddenGroupIndex();
        poliDot(); debugger;
        TableColumnResize.updateColumnWidth();
        $('.crm-table-wrapper').getNiceScroll().remove();
        niceScrollInit();
    });

    eventPath = '.table-dropdown li input';
    $(document).off('click', eventPath).on('click', eventPath, function(){
        ListViewDisplay
            .setThis(this)
            .setIndex()
            .setHiddenGroupIndex();
        poliDot();

        TableColumnResize.updateColumnWidth();
        ListView.changeShadow();
        //ListView.getInstance().colResizable();

        NiceScroll
            .createInstance()
            .setElement($('.crm-table-wrapper'))
            .setPosition(true)
            .init();
    });

    /* Drag table columns was here*/


    eventPath = '.crm-table th :checkbox';
    $(document).off('click', eventPath).on('click', eventPath, function(e) {
        var rows = $(this).closest('.crm-table');
        if ($(this).prop('checked')) {
            rows.find('td :checkbox').prop('checked', true);
        } else {
            rows.find('td :checkbox').prop('checked', false);
        }
        e.stopPropagation();
    });

    eventPath = '.list_view_btn-import_and_replace';
    $(document).off('click', eventPath).on('click', eventPath, function(){
        $.ajax({
            url: Global.urls.url_list_view_import_postprocessing+'/'+$('.sm_extension').data('copy_id'),
            data: {
                'file' : $('#import_file').val(),
                'import_skipped' : $('#import_skipped').val(),
                'type' : 'replace',
            },
            type: "POST",
            dataType: "json",
            timeout : crmParams.global.ajax.global_timeout_import,
            beforeSend: function(){
                modalDialog.show('<div class="modal-dialog upload-modal">' +  $('#upload_template').html() + '</div>');
                $('.upload-modal .upload-status .progress-bar').width('100%').addClass('in-process');
                $('.upload-modal .upload-filename').text(Message.list['Replacing data']);
                $('.upload-modal .upload-section').hide();
                $('.upload-modal .upload-status').show();
            },
            success: function(data){
                modalDialog.hide();
                $('#container.preloader').removeClass('preloader');
                modalDialog.hide();
                instanceGlobal.contentReload
                    .prepareVariablesToGeneralContent()
                    .run();
            },
            error: function(){
                modalDialog.hide();
                Message.show([{'type': 'error', 'message': Global.urls.url_ajax_error}], true);
                $('#container.preloader').removeClass('preloader');
            }
        });

    })

    eventPath = '.list_view_btn-import_and_combine';
    $(document).off('click', eventPath).on('click', eventPath, function(){
        $.ajax({
            url: Global.urls.url_list_view_import_postprocessing+'/'+$('.sm_extension').data('copy_id'),
            data: {
                'file' : $('#import_file').val(),
                'import_skipped' : $('#import_skipped').val(),
                'type' : 'combine',
            },
            type: "POST",
            dataType: "json",
            timeout : crmParams.global.ajax.global_timeout_import,
            beforeSend: function(){
                modalDialog.show('<div class="modal-dialog upload-modal">' +  $('#upload_template').html() + '</div>');
                $('.upload-modal .upload-status .progress-bar').width('100%').addClass('in-process');
                $('.upload-modal .upload-filename').text(Message.list['Combining data']);
                $('.upload-modal .upload-section').hide();
                $('.upload-modal .upload-status').show();
            },
            success: function(data){
                modalDialog.hide();
                $('#container.preloader').removeClass('preloader');
                modalDialog.hide();
                instanceGlobal.contentReload
                    .prepareVariablesToGeneralContent()
                    .run();
            },
            error: function(){
                modalDialog.hide();
                Message.show([{'type':'error', 'message': Global.urls.url_ajax_error }], true);
                $('#container.preloader').removeClass('preloader');
            }
        });
    })

    eventPath = '#file_import_data';
    $(document).off('change', eventPath).on('change', eventPath, function(env){
        var _this = this;
        var form_data = new FormData();
        form_data.append("file", env.target.files[0]);
        form_data.append("copy_id", $('.sm_extension').data('copy_id'));
        form_data.append("this_template", $('.sm_extension').data('this_template'));
        form_data.append("pci", $('.sm_extension').data('parent_copy_id'));
        form_data.append("pdi", $('.sm_extension').data('parent_data_id'));

        instanceGlobal.preloaderShow($(_this));
        $.ajax({
            url: Global.urls.url_list_view_import+'/'+$('.sm_extension').data('copy_id'),
            data: form_data,
            timeout : crmParams.global.ajax.global_timeout_import,
            processData: false, type: "POST", dataType: 'json',
            contentType: false,
            beforeSend: function(){
                modalDialog.show('<div class="modal-dialog upload-modal">' +  $('#upload_template').html() + '</div>');
                $('.upload-modal .upload-status .progress-bar').width('0%');
                $('.upload-modal .upload-filename').text(Message.list['Import data'])
                $('.upload-modal .upload-section').hide();
                $('.upload-modal .upload-status').show();
                //$('#container').addClass('preloader');
            },
            xhr: function(){
                var xhr = $.ajaxSettings.xhr(); // получаем объект XMLHttpRequest
                xhr.upload.addEventListener('progress', function(evt){ // добавляем обработчик события progress (onprogress)
                    if(evt.lengthComputable) { // если известно количество байт
                        var percentComplete = Math.ceil(evt.loaded / evt.total * 100);
                        $('.upload-status .progress-bar').width(percentComplete+'%');
                    }
                }, false);
                return xhr;
            },
            success: function(data){
                setTimeout(function(){
                    modalDialog.hide();
                    if(data.status == true){
                        $('#container.preloader').removeClass('preloader');
                        $(_this).val('');

                        modalDialog.show(data.data, true, function(){
                            instanceGlobal.contentReload
                                .prepareVariablesToGeneralContent()
                                .run();
                        });

                    } else if(data.status == 'access_error'){
                        Message.show(data.messages, false);
                        $('#container.preloader').removeClass('preloader');
                    } else if(data.status == false){
                        Message.show(data.data, false);
                        $('#container.preloader').removeClass('preloader');
                    }
                }, 600);
            },
            error: function(){
                setTimeout(function(){
                    modalDialog.hide();
                    Message.show([{'type':'error', 'message': Global.urls.url_ajax_error }], true);
                    $('#container.preloader').removeClass('preloader');
                }, 600);
            }
        });
    });

    eventPath = '.list_view_btn-import_data';
    $(document).off('click', eventPath).on('click', eventPath, function(){
        $('#file_import_data').trigger('click');
    })


    eventPath = '.list_view_block .edit_view_select_dnt-add';
    $(document).off('click', eventPath).on('click', eventPath, function(){
        EditView.addCardSelect($(this).closest('.sm_extension'), 'list-view');
    });

    eventPath = '.list-view .edit_view_select_btn-create';
    $(document).off('click', eventPath).on('click', eventPath, function(){
        var _this = this;
        if ($(_this).is('[data-type="process"]')) {
            return;
        }

        EditView.cardSelectValidate(this, function(data){
            if(data){
                modalDialog.hide();
                EditView.addCardFromTemplate(_this);
            }
        });
        Global.blockErrors.init();
    });

    eventPath = '.modal-dialog.list-view .element[data-type="template"], .modal-dialog.process-view .element[data-type="template"], .modal-dialog.edit-view .element[data-type="template"]';
    $(document).off('change', eventPath).on('change', eventPath, function(){
        var _this = this

        EditView.changeTemplateValue(_this);
    });

    eventPath = '.select_templates_from_block';
    $(document).off('change', eventPath).on('change', eventPath, function() {
        var _this = this;
        var block_field_name = $(_this).closest('.sm_extension').find('.element[data-type="block_field_name"]').val();
        if(block_field_name) {
            $('#block_error').css('display', 'none');
            $('#template_error').css('display', 'none');
            $.ajax({
                url: Global.urls.url_list_view_load_templates_from_block +
                '/' + $(_this).closest('.sm_extension').data('copy_id'),
                data: {
                    'block_field_name' : block_field_name,
                    'block_unique_index' : $(_this).closest('.sm_extension').find('.element[data-type="block"]').val(),
                },
                type: "POST",
                dataType: "json",
                success: function(data){
                    $(_this).closest('.sm_extension').find('.element[data-type="template"]').empty();
                    $(_this).closest('.sm_extension').find('.element[data-type="template"]').append(data.templates);
                    $(_this).closest('.sm_extension').find('.element[data-type="template"]').selectpicker('refresh');

                    var template_style = ($(_this).closest('.sm_extension').find('.element[data-type="block"]').val()=='') ? 'none' : 'list-item';
                    $(_this).closest('.sm_extension').find('.element[data-type="template"]').closest('li').css('display', template_style);

                    $('#project_name_error').css('display', 'none');
                    if(!$(_this).closest('.sm_extension').find('.element[data-type="project_name"]').prop('readonly')) {
                        var template_name = $(_this).closest('.sm_extension').find('.element[data-type="template"] :selected').text();
                        $(_this).closest('.sm_extension').find('.element[data-type="project_name"]').val(template_name);
                    }

                },
                error: function(){
                    Message.show([{'type':'error', 'message': Global.urls.url_ajax_error }], true);
                },
            });
        }
    });

    eventPath = '#select_toggle_blocks_view';
    $(document).off('change', eventPath).on('change', eventPath, function() {
        _this = $('.edit-view:last');
        var block_unique_index = $('#select_toggle_blocks_view').val();

        $.ajax({
            url: Global.urls.url_edit_view_toggle_blocks +
            '/' + $(this).closest('.edit-view').data('copy_id'),
            data: {
                'block_unique_index' : block_unique_index,
            },
            type: "POST",
            success: function(data){
                if(data.status==true) {
                    var key,
                        place = _this.find(".buttons-section"),
                        attachments = _this.find('[data-name="EditViewModel[bl_attachments]"]').closest('.panel'),
                        activity = _this.find('[data-type="block_activity"]').closest('.panel');

                    _this.find('.element[data-type="block"]').each(function(e){
                        if(jQuery.inArray($(this).data('unique_index'), data.deleted) !== -1)
                            $(this).remove()
                    });
                    _this.data('block_unique_index', block_unique_index);

                    if (attachments.length) {
                        place = attachments;
                    }  else {
                        if (activity.length) place = activity;
                    }

                    key = $(data.content).filter('.panel').data('unique_index');

                    if (!_this.find('.element[data-type="block"][data-unique_index="'+ key +'"]').length) {
                        $(data.content).insertBefore(place);
                    }

                    $('.select').selectpicker({
                        style: 'btn-white',
                        noneSelectedText: '',
                    });
                }
            },
            error: function(){
                Message.show([{'type':'error', 'message': Global.urls.url_ajax_error }], true);
            },
        });
    });

    eventPath = '.edit_view_dnt-save';
    // сохраняем импортированные данные
    $(document).off('click', eventPath).on('click', eventPath, function(){
        var _this = this;
        var _copy_id = $(_this).closest('.sm_extension').data('copy_id');
        $.ajax({
            url: Global.urls.url_list_view_save_imported+'/'+_copy_id,
            dataType: "json",
            type: "POST",
            success: function(data) {
                if(data.status == 'access_error'){
                    Message.show(data.messages, false);
                } else {
                    if(data.status == 'error'){
                        Message.show(data.messages);
                    } else {
                        document.location.reload();
                    }
                }
            },
            error: function(){
                Message.show([{'type':'error', 'message':  Global.urls.url_ajax_error }], true);
            },
        });
    });

    // отменяем импортирование данных
    eventPath = '.edit_view_dnt-cancel';
    $(document).off('click', eventPath).on('click', eventPath, function(){
        var _this = this;

        var _function = function(){
            var _copy_id = $(_this).closest('.sm_extension').data('copy_id');
            $.ajax({
                url: Global.urls.url_list_view_cancel_imported + '/' + _copy_id,
                dataType: "json",
                type: "POST",
                success: function(data){
                    if(data.status == 'access_error'){
                        Message.show(data.messages, false);
                    } else {
                        if(data.status == 'error'){
                            Message.show(data.messages);
                        } else {
                            document.location.reload();
                        }
                    }
                },
                error: function(){
                    Message.show([{'type': 'error', 'message': Global.urls.url_ajax_error}], true);
                },
            });
        }


        Message.show([{'type':'confirm', 'message': Message.translate_local('Delete imported data?')}], false, function(_this_c){
            if($(_this_c).hasClass('yes-button')){
                modalDialog.hide();
                _function();
            }
        }, Message.TYPE_DIALOG_CONFIRM);


    });

    //list_view_btn-additional_update
    eventPath = '.list_view_btn-additional_update';
    $(document).off('click', eventPath).on('click', eventPath, function(){
        var _data = [];
        var _this = this;

        if($('.sm_extension_data input:checked').length == 0){
            Message.show([{'type':'error', 'message': 'It should be noted entries'}], true);
            return;
        }


        var _function = function(){
            $('.sm_extension_data input:checked').each(function(i, ul){
                _data.push($(ul).closest('.sm_extension_data').data('id'));
            });

            _data = {
                'id': _data,
                'this_template': $(_this).closest('.list_view_block.sm_extension, .process_view_block.sm_extension').data('this_template'),
            }

            var ajax = new Ajax();
            ajax
                .setData(_data)
                .setAsync(false)
                .setUrl(Global.urls.url_list_view_additional_update + '/' + $(_this).closest('.sm_extension').data('copy_id') + '?scenario=additional_update')
                .setTimeOut(0)
                .setCallBackSuccess(function(data){
                    Message.show(data.messages, false);
                    document.location.reload();
                })
                .setCallBackError(function(jqXHR, textStatus, errorThrown){
                    Message.showErrorAjax(jqXHR, textStatus);
                })
                .send();
        }


        Message.show([{'type':'confirm', 'message': Message.translate_local('Update the bills of the selected objects') + '?'}], false, function(_this_c){
            if($(_this_c).hasClass('yes-button')){
                modalDialog.hide();
                _function();
            }
        }, Message.TYPE_DIALOG_CONFIRM);
    });

    eventPath = '.list_view_btn-table_sr_export';
    $(document).off('click', eventPath).on('click', eventPath, function(){
        var _data = [];
        var _this = this;

        if($('.sm_extension_data input:checked').length == 0){
            Message.show([{'type':'error', 'message': 'It should be noted entries'}], true);
            return;
        } else {
            $('.sm_extension_data input:checked').each(function(i, ul){
                _data.push($(ul).closest('.sm_extension_data').data('id'));
            });
        }

        all_checked = ($('#list-table').find('thead .checkbox[type="checkbox"]:checked').length) ? 1 : 0;
        document.location.href = Global.urls.url_list_view_additional_update + '/' + $(_this).closest('.sm_extension').data('copy_id') + '?scenario=table_sr_export&all_checked=' + all_checked + '&id=' + JSON.stringify(_data);

    });

    //list_view_row-delete
    eventPath = '.list_view_row-delete';
    $(document).off('click', eventPath).on('click', eventPath, function(){
        var _this = this;

        Message.show([{'type':'confirm', 'message': Message.translate_local('Delete data') + '?'}], false, function(_this_c){
            if($(_this_c).hasClass('yes-button')){
                modalDialog.hide();

                $.post(Global.urls.url_list_view_delete+'/'+$(_this).closest('.sm_extension').data('copy_id'), {'id': [$(_this).closest('.sm_extension_data').data('id')]}, function(data){
                    if(data.status){
                        $(_this).closest('tr').remove();
                    } else {
                        Message.show(data.messages, false);
                    }
                }, 'json');
            }
        }, Message.TYPE_DIALOG_CONFIRM);

    });

    $('select[name="list-table_length"], select[name="settings-table_length"]').selectpicker({
        style: 'btn-white',
        noneSelectedText: Message.translate_local('None selected'),
    });

    var getColumnHidden = function(){
        var col_index = [];
        $('.list-table thead').find('th').each(function(i, ul){
            if(i==0) return true;
            if($(ul).css('display') == 'none') return true;
            col_index[$(ul).data('group_index')] = $(ul).width();
        });
        return col_index;
    }




    /**
     *   save_to_pdf
     */
    eventPath = '.list_view_btn-export_to_pdf';
    $(document).off('click', eventPath).on('click', eventPath, function(){
        var _this = $('.sm_extension_export:not(.is-page-report)');
        var fields = [];

        $(_this).closest('.edit-view').find('input[type="checkbox"]:checked').each(function(i, ul){
            fields.push($(ul).data('name'));
        })
        modalDialog.hide();

        var ids = [];

        if($('.sm_extension_data input:checked').length != 0){
            $('.sm_extension_data input:checked').each(function(i, ul){
                ids.push($(ul).closest('.sm_extension_data').data('id'));
            });
        }

        var copy_id = $('.sm_extension').data('copy_id');
        var params = 'page_size=0&col_hidden=' + ListViewDisplay._hidden_group_index + '&type=pdf' + '&fields=' + JSON.stringify(fields) + '&ids=' + JSON.stringify(ids);
        if(document.location.search == '') {
            document.location.href = Global.urls.url_list_view_export + '/' + copy_id + '?' + params;
        } else {
            var url_params = Url.getWithOutParams(document.location.href, ['page_size'], true);
            document.location.href = Global.urls.url_list_view_export + '/' + copy_id + '?' + url_params + '&' + params;
        }
    })



    /**
     *   generate file from template
     */
    eventPath = '.list_view_btn-generate';
    $(document).off('click', eventPath).on('click', eventPath, function(){

        var copy_id = $('.sm_extension').data('copy_id'); //ID экзампляра модели
        var uploadID = $(this).closest('.upload-result').find('.image-preview').data('id');
        var parentUploadID = $(this).closest('.upload-result').find('.image-preview').data('parent_id');
        var _this = $('.edit-view[data-parent_copy_id="'+copy_id+'"]');


        var params = {};

        var _contentType = 'application/x-www-form-urlencoded';
        var date_time = '';

        // данные текущей формы
        _this.find('.element_data[data-type="module_title"], .element_edit_hidden, .element[data-type="block_panel_contact"] .file-box, .element[data-type="block"] .element[data-type="panel"] .file-box, .element[data-type="block"] .element[data-type="attachments"], .element[data-type="block"] .element[data-type="block_activity"], input[type="text"], input[type="password"], input[type="email"], input[type="submit"], input[type="button"], input[type="hidden"]:not(.upload_file), input:checked, select').each(function(){
            if($(this).hasClass('date')){
                if($(this).val()) date_time = $(this).val(); else date_time = '';
            } else
            if($(this).hasClass('time')){
                if($(this).val())
                    if(date_time) date_time += ' ' + $(this).val();
                params[$(this).attr('name')] = date_time;
                date_time = '';
            } else
            if($(this).hasClass('datetime')){
                params[$(this).attr('name')] = $(this).val() + ' 23:59:59';
            } else
            if($(this).hasClass('element_data')){
                params[$(this).data('name')] = $(this).text();
            } else
            //attachments
            if($(this).hasClass('element') && $(this).data('type') == 'attachments'){
                var _files = [];
                $(this).find('.file-box .file-block[data-type="attachments"]').each(function(i, ul){
                    $(this).find('input.upload_file').each(function(i, ul){
                        if($(ul).val()) _files.push($(ul).val());
                    });
                })
                params[$(this).data('name')] = _files;
            } else
            //block_activity
            if($(this).hasClass('element') && $(this).data('type') == 'block_activity'){
                var activity_messages = [];
                $(this).find('.element[data-type="message"]').each(function(i, ul){
                    if($(ul).data('status') == 'temp') activity_messages.push($(ul).data('id'));
                });
                params['element_block_activity'] = activity_messages;
            } else
            if($(this).hasClass('element_edit_hidden')){
                params[$(this).data('name')] = $(this).text();
            } else
            if($(this).hasClass('element_edit_access')){
                params[$(this).attr('name')] = {'id' : $(this).val(), 'type' :  $(this).find('option[value="'+$(this).val()+'"]').data('type')};
            } else {

                //для селекта показываем текст, а не значение
                if($(this).is("select"))
                    params[$(this).attr('name')] = $(this).find('option:selected').text();else
                    params[$(this).attr('name')] = $(this).val();

            }

        });


        //связанные данные (СДМ)
        var params_sdm = {};

        $(_this).closest('.edit-view').find('.element_relate').each(function(i, ul){
            realte_result = $(ul).data('id');
            if(!realte_result) realte_result = false;
            params_sdm[$(ul).data('relate_copy_id')] = realte_result;
        });

        //связанные данные (Сабмодули)
        var params_sm = [];
        var submodule_tmp = [];
        $(modalDialog.getModalName() + ' .sm_extension[data-type="submodule"]').each(function(i, ul){
            $(ul).find('table tbody tr').each(function(i1, ul1){
                submodule_tmp.push($(ul1).data('id'));
            });
            params_sm.push({
                'relate_table_module_id' :  $(ul).data('relate_table_module_id'),
                'relate_copy_id' :  $(ul).data('relate_copy_id'),
                'data_id_list': submodule_tmp,
            });
            submodule_tmp = [];
        });

        //служебные данные
        var params_service = {};

        params_service['upload_id'] = uploadID; //uploadID
        params_service['parent_upload_id'] = parentUploadID; //upload ParentID
        params_service['module_id'] = _this.data('parent_data_id'); //ID экземпляра модуля, с которого генерируется документ
        params_service['module_generate_id'] = _this.data('copy_id'); //ID модуля, который генерирует ссылку (Документы)
        params_service['doc_id'] = _this.data('id'); //ID генерируемого документа

        //передаваемый массив
        var data = {};


        data['form_data'] = params;
        data['sdm_data'] = params_sdm;
        data['sm_data'] = params_sm;
        data['service_data'] = params_service;

        $.ajax({
            url: Global.urls.url_list_view_generate+'/'+copy_id,
            data: 'params=' + JSON.stringify(data),
            type: "POST",
            dataType: 'json',
            success: function(data){

                if(data.status == 'popup')
                    modalDialog.show(data.data, true);

                if(data.status == true) {


                    if(!!data.link)
                        $('.generate_file-download' + uploadID).attr("href", data.link);

                    if(!!data.title)
                        $('.filename.generate_file-block' + uploadID).text(data.title);

                    if(!!data.extension){
                        $('.file_thumb.generate_file-block' + uploadID).text(data.extension);
                        $('.file_thumb.generate_file-block' + uploadID).removeClass('file_other');
                        $('.file_thumb.generate_file-block' + uploadID).addClass('file_application');
                    }

                    if(!!data.filedate)
                        $('.filedate.generate_file-block' + uploadID).text(data.filedate);

                    $('.file_thumb.generate_file-block' + uploadID).closest('.generate_only').removeClass('generate_only');
                    $('.file_thumb.generate_file-block' + uploadID).parent().parent().find('.upload_link').hide();
                    $('.file_thumb.generate_file-block' + uploadID).parent().find('.second-row').addClass('linkMore2');

                    $('.generate_file-block' + uploadID).show();
                    $('.generate_link_file-block' + uploadID).css('margin-left', '8px');
                    $('.generate_link_file-block' + uploadID).css('margin-top', '0px');

                    if(!!data.show_edit_link)
                        $('.generate_edit_link_file-block' + uploadID).show();

                }

            },
            error: function(xhr, ajaxOptions, thrownError){
                //Message.show([{'type':'error', 'message': Global.urls.url_ajax_error }], true);
                Message.show([{'type':'error', 'message':xhr.responseText}], true);
            }
        });

    })


    /**
     *   generate file from template after select sm links
     */
    eventPath = '.edit_view_select_btn-generate';
    $(document).off('click', eventPath).on('click', eventPath, function(){
        var _this = $('.sm_extension_generate');
        var params_sm = {};

        $(_this).closest('.edit-view').find('.element_relate').each(function(i, ul){
            var copy_id_list = [];
            var relate_result = $(ul).data('id');
            if(!relate_result) relate_result = false;

            $(ul).closest('.column').find('table input[type="checkbox"]:checked').each(function(i, ul) {
                copy_id_list.push($(ul).closest('.sm_extension_data').data('id'));
            });

            params_sm[$(ul).data('relate_copy_id')] = {
                'copy_id_list' : copy_id_list,
                'relate_result' : relate_result,
                'its_no_documents_module' : $(ul).data('mod_id')
            };

        });

        var data = {};

        data['form_data'] = JSON.parse(_this.find('.element[data-name="form_data"]').val());
        data['sdm_data'] = JSON.parse(_this.find('.element[data-name="sdm_data"]').val());
        data['sm_data'] = JSON.parse(_this.find('.element[data-name="sm_data"]').val());
        data['service_data'] = JSON.parse(_this.find('.element[data-name="service_data"]').val());
        data['vars'] = _this.find('.element[data-name="vars"]').val();
        data['sm_data_new'] = params_sm;
        data['sm_data_select'] = true;

        copy_id = _this.find('.element[data-name="copy_id"]').val();
        var uploadID = data['service_data']['upload_id'];

        $.ajax({
            url: Global.urls.url_list_view_generate+'/'+copy_id,
            data: 'params=' + JSON.stringify(data),
            type: "POST",
            dataType: 'json',
            success: function(data){

                if(data.status == true) {
                    modalDialog.hide();

                    if(!!data.link)
                        $('.generate_file-download' + uploadID).attr("href", data.link);

                    if(!!data.name)
                        $('.filename.generate_file-block' + uploadID).text(data.name);

                    if(!!data.extension){
                        $('.file_thumb.generate_file-block' + uploadID).text(data.extension);
                        $('.file_thumb.generate_file-block' + uploadID).removeClass('file_other');
                        $('.file_thumb.generate_file-block' + uploadID).addClass('file_application');
                    }

                    if(!!data.filedate)
                        $('.filedate.generate_file-block' + uploadID).text(data.filedate);

                    $('.file_thumb.generate_file-block' + uploadID).closest('.generate_only').removeClass('generate_only');
                    $('.file_thumb.generate_file-block' + uploadID).parent().parent().find('.upload_link').hide();
                    $('.file_thumb.generate_file-block' + uploadID).parent().find('.second-row').addClass('linkMore2');

                    $('.generate_file-block' + uploadID).show();
                    $('.generate_link_file-block' + uploadID).css('margin-left', '8px');
                    $('.generate_link_file-block' + uploadID).css('margin-top', '0px');

                    if(!!data.show_edit_link)
                        $('.generate_edit_link_file-block' + uploadID).show();
                }

            },
            error: function(xhr, ajaxOptions, thrownError){
                //Message.show([{'type':'error', 'message': Global.urls.url_ajax_error }], true);
                Message.show([{'type':'error', 'message':xhr.responseText}], true);
            }
        });

    })

    /**    *   Массовое редактирование    */
    eventPath = '.list_view_btn-bulk_edit';
    $(document).off('click', eventPath).on('click', eventPath, function() {
        if ($('.crm-table .lot-edit').length) return;
        instanceLotEdit = instanceLotEdit ? instanceLotEdit : new LotEdit();
        instanceLotEdit.onClickByBtnLotEdit($(this));
    });

    eventPath = '#list-table tbody .checkbox';
    $(document).off('click', eventPath).on('click', eventPath, function () {
        $(this).closest('table').find('thead .checkbox').prop('checked', false);
    });

    // hover на поле Название
    $(".list_view_block #list-table .data_edit .modal_dialog").hover(
        function () {
            $(this).closest('.data_edit').find('.modal_dialog').each(function(i, ul){
                $(this).css("text-decoration", "none");
            });
        },
        function () {
            $(this).closest('.data_edit').find('.modal_dialog').each(function(i, ul){
                $(this).css("text-decoration", "underline");
            });
        }
    );

    //pagination-size select scroll bug fix
    eventPath = '.pagination_size button';
    $(document).off('click', eventPath).on('click', eventPath, function(){
        $(this).find('ul.dropdown-menu').getNiceScroll().remove();
    });

    eventPath = '.instruments .dropdown-menu li';
    $(document).off('click', eventPath).on('click', eventPath, function(){
        $(this).closest('.instruments.open').removeClass('open');
    });
});
