/**
 * Created by jason on 2015/11/9.
 */

/**
 * UI Component. ExpandListView
 * <pre>
 *     opt = {
 *          parentSelector:
 *          loadingSelector:
 *          itemTemplate:
 *          loadingTemplate:
 *          loadingWord:
 *          colCount: [number]
 *          loadMoreFn: [function(callbcak([Object]data, [boolean]hasMore))] the ajax function to get mor
 *          itemCallback: [function([Object]data, [Object]itemView] callback when item view created.e data.
 *          refreshPartCallback: [function([Object]data, [Object]itemView] callback when call refreshPartOfItem().
 *          draggable: [boolean]
 *          droppable: [boolean]
 *          droppable_hover: [string]
 *          droppable_scope: [string]
 *          droppable_drop: [function(draggableElement, droppableElement, data, event)]
 *          droppable_over: [function(draggableElement, droppableElement, data, event)]
 *          droppable_out: [function(draggableElement, droppableElement, data, event)]
 *     }
 * </pre>
 * @param opt
 */
function ExpandListView(opt) {
    opt = opt || {};
    this.parentSelector = opt.parentSelector;
    this.loadingSelector = opt.loadingSelector;
    this.itemTemplate = opt.itemTemplate;
    this.loadingTemplate = opt.loadingTemplate;
    this.loadingWord = opt.loadingWord;
    this.colCount = opt.colCount || 1;
    this.loadMoreFn = opt.loadMoreFn;
    this.itemCallback = opt.itemCallback;
    this.refreshPartCallback = opt.refreshPartCallback;
    this.draggable = opt.draggable;
    this.droppable = opt.droppable;
    this.droppable_hover = opt.droppable_hover;
    this.droppable_scope = opt.droppable_scope;
    this.droppable_drop = opt.droppable_drop;
    this.droppable_over = opt.droppable_over;
    this.droppable_out= opt.droppable_out;

    this.more = !!opt.loadMoreFn;// 如果没有加载更多的方法，则默认不能加载更多
    this.loading = false;
    this.scrollListener = null;

    this.loadMore = function () {
        if (!this.more || this.loading || !this.loadMoreFn) {
            return;
        }
        this.loading = true;
        var loadingTip = $(this.loadingSelector);
        if (!loadingTip) {// loadingTip not exist, add
            $(this.parentSelector).html(ejs.renderFile(this.loadingTemplate,
                {word : this.loadingWord}, {cache:true}));
        }
        loadingTip.show();
        var that = this;
        this.loadMoreFn(function (data, hasMore) {
            if (!hasMore) {
                that.more = false;
                //$('#list-loading-word').text('no more data');
            }
            if (data) {
                that.render(data);
            }
            $(that.loadingSelector).hide();
            that.loading = false;
        });
    };
    this.initItem = function(data, itemView) {
        // set draggable
        if (this.draggable) {
            itemView.draggable({
                zIndex: 1070,
                revert: true,
                opacity : 0.5,
                cursor : 'move',
                delay : 50, // prevent unwanted drags when clicking on an element
                distance: 5 // prevent unwanted drags when clicking on an element
            });
        }
        // set droppable
        if (this.droppable) {
            var that = this;
            var element = itemView.children();
            element.droppable({
                tolerance : 'intersect',
                hoverClass : this.droppable_hover,
                scope : this.droppable_scope ? this.droppable_scope : 'default',
                drop : function(event, ui) {
                    if (that.droppable_drop) {
                        that.droppable_drop(ui.draggable, element, data, event);
                    }
                },
                out : function(event, ui) {
                    if (that.droppable_out) {
                        that.droppable_out(ui.draggable, element, data, event);
                    }
                },
                over : function(event, ui) {
                    if (that.droppable_over) {
                        that.droppable_over(ui.draggable, element, data, event);
                    }
                }
            });
        }
        // callback
        if (this.itemCallback) {
            this.itemCallback(data, itemView);
        }
    };
    this.refreshPartOfItem = function(data) {
        var itemView = $('#expandlist-item-' + data.id);
        if (!itemView) {
            return;
        }
        // callback
        if (this.refreshPartCallback) {
            this.refreshPartCallback(data, itemView);
        }
    };
    this.refreshEntireItem = function(data) {
        var itemView = $('#expandlist-item-' + data.id);
        if (!itemView) {
            return;
        }
        var itemContent = ejs.renderFile(this.itemTemplate, data, {cache:true});
        itemView.html(itemContent);
        // init item
        this.initItem(data, itemView);
    };
    this.render = function (datas) {
        if (!datas || datas.length <= 0) return;

        var content = '';
        var index = 0;
        var rowCount = Math.ceil(datas.length / this.colCount);
        for (var row = 0; row < rowCount; row++) {
            content = content + '<div class="row">';
            for (var i = 0; i < this.colCount; i++) {
                if (index >= datas.length) {
                    break;
                }
                var item = '<div class="col-lg-3 col-xs-6" id="expandlist-item-'+ datas[index].id + '">' +
                    ejs.renderFile(this.itemTemplate, datas[index], {cache:true}) + '</div>';
                content = content + item;
                index++;
            }
            content = content + '</div>';
        }
        if (this.more) {
            var loadingTip = ejs.renderFile(this.loadingTemplate,
                {word : this.loadingWord}, {cache:true});
            content = content + loadingTip;
        }
        $(this.loadingSelector).remove();// 必须是remove..
        $(this.parentSelector).append(content);
        // init item
        for (var d = 0; d < datas.length; d++) {
            this.initItem(datas[d], $('#expandlist-item-' + datas[d].id));
        }
    };
    this.clear = function () {
        $(this.parentSelector).html(ejs.renderFile(this.loadingTemplate,
            {word : this.loadingWord}, {cache:true}));
        $(this.loadingSelector).hide();
    };
    this.registerScrollListener = function () {
        if (this.scrollListener) return;
        var that = this;
        this.scrollListener = function () {
            // When scroll at bottom, invoked loadMore() function.
            if ($(window).scrollTop() + $(window).height() == $(document).height()) {
                console.log(new Date().toString(), 'scroll bottom');
                if (that.more && !that.loading && that.loadMoreFn) {
                    console.log(new Date().toString(), 'loadMore!');
                    that.loadMore();
                }
            }
        };
        $(window).bind('scroll', this.scrollListener);
    };
    this.unregisterScrollListener = function () {
        if (!this.scrollListener) return;
        $(window).unbind('scroll', this.scrollListener);
        this.scrollListener = null;
    };
}

/**
 * UI Component. EditableListView
 * <pre>
 *     opt = {
 *          parentSelector: [string]
 *          inputSelector: [string]
 *          inputCollapseSelector: [string]
 *          itemDeleteSelector: [string] under item
 *          itemTemplate:
 *          addFn:
 *          removeFn:
 *          selectFn:
 *          selectClass: [string] the class of css when selectable
 *          draggable: [boolean]
 *          droppable_scope: [string]
 *          droppable_start: [function(event, ui)]
 *          droppable_stop: [function(event, ui)]
 *     }
 * </pre>
 * @param opt
 */
function EditableListView(opt) {
    opt = opt || {};
    this.parentSelector = opt.parentSelector;
    this.inputSelector = opt.inputSelector;
    this.inputCollapseSelector = opt.inputCollapseSelector;
    this.itemDeleteSelector = opt.itemDeleteSelector;
    this.itemTemplate = opt.itemTemplate;
    this.addFn = opt.addFn;
    this.removeFn = opt.removeFn;
    this.selectFn = opt.selectFn;
    this.selectClass = opt.selectClass;
    this.draggable = opt.draggable;
    this.draggable_scope = opt.draggable_scope;
    this.draggable_start = opt.draggable_start;
    this.draggable_stop = opt.draggable_stop;
    this.render = function (tags) {
        if (!tags) return;
        // generate html
        var dataArray = [];
        var content = '';
        for (var tag in tags) {
            dataArray.push(tag);
            var html = ejs.renderFile(this.itemTemplate, {
                tag : tag,
                tagCount: tags[tag].size
            }, {cache:true});
            content = content + html;
        }
        var parent = $(this.parentSelector);
        parent.html(content);
        // register draggable, select, remove listener
        var that = this;
        var items = parent.children();
        for (var i = 0; i < items.length; i++) {
            var item = $(items[i]);
            if (this.draggable) {// set draggable
                item.data('data', dataArray[i]);
                item.draggable({
                    scope : this.draggable_scope ? this.draggable_scope : 'default',
                    zIndex: 1070,
                    revert: true,
                    cursor : 'move',
                    opacity : 0.5,
                    delay : 50, // prevent unwanted drags when clicking on an element
                    distance: 5, // prevent unwanted drags when clicking on an element
                    start: function(element) {
                        return function (event, ui) {
                            if (that.selectClass) {
                                element.removeClass(that.selectClass);
                            }
                            if (that.draggable_start) {
                                that.draggable_start(event, ui);
                            }
                        }
                    }(item),
                    stop: function(element) {
                        return function (event, ui) {
                            if (that.selectClass) {
                                element.addClass(that.selectClass);
                            }
                            if (that.draggable_stop) {
                                that.draggable_stop(event, ui);
                            }
                        }
                    }(item)
                });
            }
            if (this.selectClass) {// set clickable cursor when hover
                item.addClass(this.selectClass);
            }
            // select listener
            if (this.selectFn) {// set selectFn
                item.click(item.data('data'), function (event) {
                    that.selectFn(event.data);
                });
            }
            // remove listener
            item.find(this.itemDeleteSelector).click(item.data('data'), function (event) {
                event.preventDefault();
                event.stopPropagation();
                var element = $(this);
                // invoke removeFn
                if (that.removeFn) {
                    that.removeFn(event.data, function(result) {
                        if (result) {
                            $.AdminLTE.boxWidget.remove($(element));
                        }
                    });
                }
            });
        }
    };
    this.init = function() {
        // init addTag Listener
        var that = this;
        var inputCollapse = $(this.inputCollapseSelector);
        var inputComponent = $(this.inputSelector);
        inputComponent.keydown(function (event) {
            switch (event.which) {
                case 13:
                    var inputTag = inputComponent.val();
                    if (!inputTag) {// cannot input empty tag
                        shake(inputComponent, 6, 10, 100);
                    } else {
                        // invoke addFn
                        if (that.addFn) {
                            that.addFn(inputTag, function(newTags) {
                                inputComponent.val('');// 清空
                                if (newTags) {
                                    // render new tagList
                                    that.render(newTags);
                                }
                                // 触发add-btn的点击事件，使添加的控件收缩回去
                                if (inputCollapse) {
                                    inputCollapse.click();
                                }
                            });
                        }
                    }
                    break;
                case 27:
                case 53:
                    if (inputCollapse) {
                        inputCollapse.click();
                    }
                    break;
            }
        });
    };
}

/**
 * UI Component. FullHeightIFrame
 */
function FullHeightIFrame(frameSelector, parentSelector, wrapperHeight) {
    this.frameSelector = frameSelector;
    this.parentSelector = parentSelector;
    this.wrapperHeight = wrapperHeight;
    this.resizeListener = null;

    this.setContent = function (url) {
        var iframe = $(this.frameSelector);
        if (iframe) {
            iframe.attr('src', url);
            // set height
            var content_height = parseInt($(this.parentSelector).css('min-height'));
            console.log(new Date().toString(), 'init! content_min_height:' + content_height);
            iframe.attr('height', content_height - this.wrapperHeight);
        }
    };
    this.registerResizeListener = function () {
        if (this.resizeListener) return;
        var that = this;
        this.resizeListener = function () {
            var iframe = $(that.frameSelector);
            if (iframe) {
                var content_height = parseInt($(that.parentSelector).css('min-height'));
                console.log(new Date().toString(), 'resize! content_min_height:' + content_height);
                iframe.attr('height', content_height - that.wrapperHeight);
            }
        };
        $(window).bind('resize', this.resizeListener);
    };
    this.unregisterResizeListener = function () {
        if (!this.resizeListener) return;
        $(window).unbind('resize', this.resizeListener);
        this.resizeListener = null;
    };
}

/**
 * 控件震动动画
 * @param element 控件
 * @param time 震动时间长——短循环长度
 * @param wh 震动幅度px
 * @param fx 动画速度s
 */
function shake(element, time, wh, fx) {
    $(function() {
        var offset = element.offset();
        var x = offset.left;
        var y = offset.top;
        for (var i = 1; i <= time; i++) {
            if (i % 2 == 0) {
                element.animate({left: '+' + wh + 'px'}, fx);
            } else {
                element.animate({left: '-' + wh + 'px'}, fx);
            }
        }
        element.animate({left:0}, fx);
        element.offset({ left: x, top: y });
    })
}

$.ShanFox = {
    data : {
        marketUrl : {
            chrome: 'https://chrome.google.com/webstore/category/extensions?hl=zh-CN',
            baidu: 'http://chajian.baidu.com/',
            sougou: 'http://ie.sogou.com/app/',
            '360jisu' : 'https://ext.chrome.360.cn/webstore/category/%E5%85%A8%E9%83%A8/%E6%9C%AC%E5%91%A8%E7%83%AD%E9%97%A8',
            '360anquan' : 'https://ext.se.360.cn/webstore/home',
            liebao: 'http://store.liebao.cn/',
            uc: 'http://extensions.uc.cn/newindex.htm#!hot/recommendation'
        },

        /**
         * 所有缓存的extension对象
         * allExtMap = {
         *     id : {extension},
         *     ...
         * }
         */
        allExtension : {},

        /**
         * 按照tag分类的extension对象
         * taggedExtension = {
         *          '娱乐':[{
         *                     id:asdf6asdfasa3sdfasdfasasdfasdfas,
         *                     name:HelloWord,
         *                     size:704,
         *                     tag:['娱乐']
         *                   },
         *                   ...],
         *           ...
         *         }
         */
        taggedExtension : {},

        /**
         * 没有tag的extension对象的有序集合
         * rawExtension = [
         *    {
         *         id:asdf6asdfasa3sdfasdfasasdfasdfas,
         *         name:HelloWord,
         *         size:704,
         *         tag:['娱乐']
         *     },
         *     ...]
         */
        rawExtension: [],
        /**
         * 没有tag的extension总数
         */
        rawExtSize: 0,

        /**
         * 所有tag的集合
         * tags = {
         *   '购物': {name:'购物', size:112, createdTime:1433593929, order:0},
         *   '娱乐'：{name:'娱乐', size:12344, createdTime:1433553337, order:0}，
         *   ...
         * }
         */
        tags: null,
        tagArray: []
    },
    ajax : {
        tag : {
            add : function(tag, callback) {
                $.ajax({
                    url: 'tag/add',
                    type: 'POST',
                    data: {tag : tag},
                    success: function(data, textStatus, xhr) {
                        var result = data && data.result;
                        if (result) {
                            if(!$.ShanFox.data.tags) {
                                $.ShanFox.data.tags = {};
                            }
                            $.ShanFox.data.tags[tag] = {
                                name:tag,
                                size:0,
                                createdTime:new Date().getTime(),
                                order:$.ShanFox.data.tagArray.length
                            };
                            $.ShanFox.data.tagArray.push(tag);
                        }
                        if (callback) {
                            callback(result);
                        }
                    },
                    error: function(xmlHttpRequest, textStatus, errorThrown) {
                        console.log(new Date().toString(), '[tag.add]error!' + errorThrown.toString());
                        if (callback) {
                            callback(false);
                        }
                    }
                });
            },
            remove : function(tag, callback) {
                $.ajax({
                    url: 'tag/remove',
                    type: 'POST',
                    data: {tag : tag},
                    success: function(data, textStatus, xhr) {
                        var result = data && data.result;
                        var rawChange = false;
                        if (result) {
                            if ($.ShanFox.data.taggedExtension[tag]) {
                                for (var i = 0; i < $.ShanFox.data.taggedExtension[tag].length; i++) {
                                    if ($.ShanFox.data.taggedExtension[tag][i].tag) {
                                        var index = $.ShanFox.data.taggedExtension[tag][i].tag.indexOf(tag);
                                        if (index != -1) {
                                            $.ShanFox.data.taggedExtension[tag][i].tag.splice(index, 1);
                                            if ($.ShanFox.data.taggedExtension[tag][i].tag.length === 0) {
                                                // TODO refresh raw size and rawList
                                                rawChange = true;
                                            }
                                        }
                                    }
                                }
                            }
                            if ($.ShanFox.data.tags) {
                                delete $.ShanFox.data.tags[tag];
                                delete $.ShanFox.data.taggedExtension[tag];
                                var index2 = $.ShanFox.data.tagArray.indexOf(tag);
                                if (index2 != -1) {
                                    $.ShanFox.data.tagArray.splice(index2, 1);
                                }
                            }
                        }
                        if (callback) {
                            callback(result, rawChange);
                        }
                    },
                    error: function(xmlHttpRequest, textStatus, errorThrown) {
                        console.log(new Date().toString(), '[tag.remove]error!' + errorThrown.toString());
                        if (callback) {
                            callback(false);
                        }
                    }
                });
            },
            getAll : function(callback) {
                $.getJSON('tag/getAll', {withRaw : true}, function(data) {
                    $.ShanFox.data.tags = data.tags;
                    $.ShanFox.data.tagArray.length = 0;
                    for (var tag in $.ShanFox.data.tags) {
                        $.ShanFox.data.tagArray.push(tag);
                    }
                    $.ShanFox.data.rawExtSize = data.raw ? data.raw : 0;
                    if (callback) {
                        callback(data.tags);
                    }
                })
            }
        },
        extension : {
            getTaggedByPage : function(callback) {
                var tag = $.ShanFox.ui.currentTag;
                if (!tag) {
                    console.log(new Date().toString(), '[getTaggedByPage]tag not exsit!do nothing!');
                    if (callback) {
                        callback(null, true);
                    }
                    return;
                }
                var offset = $.ShanFox.data.taggedExtension[tag] ? $.ShanFox.data.taggedExtension[tag].length : 0;
                $.ajax({
                    url: 'ext/tagged/getAllByPage',
                    type: 'GET',
                    contentType: 'application/json; charset=utf-8',
                    dataType: 'json',
                    data: {
                        offset : offset,
                        count : 24,
                        tag : tag
                    },
                    success: function(data, textStatus, xhr) {
                        if (data.exts && data.exts.length > 0) {
                            for (var i = 0; i < data.exts.length; i++) {
                                if (!$.ShanFox.data.allExtension[data.exts[i].id]) {
                                    // cache new extension data
                                    $.ShanFox.data.allExtension[data.exts[i].id] = data.exts[i];
                                } else {
                                    // update local extension data
                                    for(var property in data.exts[i]) {
                                        $.ShanFox.data.allExtension[data.exts[i].id][property] = data.exts[i][property];
                                    }
                                }
                                // add to taggedExtension
                                if(!$.ShanFox.data.taggedExtension[tag]) {
                                    $.ShanFox.data.taggedExtension[tag] = [];
                                }
                                if ($.ShanFox.data.taggedExtension[tag].indexOf($.ShanFox.data.allExtension[data.exts[i].id]) === -1) {
                                    $.ShanFox.data.taggedExtension[tag].push($.ShanFox.data.allExtension[data.exts[i].id]);
                                }
                            }
                        }
                        var loadedCount = parseInt(data.count);
                        var hasMore = loadedCount == 24;
                        console.log(new Date().toString(), '[getTaggedByPage]success!tag=' + tag +
                        ',offset=' + offset + ',count=' + 24 + ',returnCount=' + loadedCount + ',returnExts=' + data.exts);
                        if (callback) {
                            callback(data.exts, hasMore);
                        }
                    },
                    error: function(xmlHttpRequest, textStatus, errorThrown) {
                        console.log(new Date().toString(), '[getTaggedByPage]error!' + errorThrown.toString());
                        if (callback) {
                            callback(null, true);
                        }
                    }
                });
            },
            getRawByPage : function(callback) {
                var offset = $.ShanFox.data.rawExtension.length;
                $.ajax({
                    url: 'ext/raw/getAllByPage',
                    type: 'GET',
                    contentType: 'application/json; charset=utf-8',
                    dataType: 'json',
                    data: {
                        offset : offset,
                        count : 24
                    },
                    success: function(data, textStatus, xhr) {
                        if (data.exts) {
                            for (var i = 0; i < data.exts.length; i++) {
                                if (!$.ShanFox.data.allExtension[data.exts[i].id]) {
                                    // cache new extension data
                                    $.ShanFox.data.allExtension[data.exts[i].id] = data.exts[i];
                                } else {
                                    // update local extension data
                                    for(var property in data.exts[i]) {
                                        $.ShanFox.data.allExtension[data.exts[i].id][property] = data.exts[i][property];
                                    }
                                }
                                // add to rawExtension
                                if ($.ShanFox.data.rawExtension.indexOf($.ShanFox.data.allExtension[data.exts[i].id]) === -1) {
                                    $.ShanFox.data.rawExtension.push($.ShanFox.data.allExtension[data.exts[i].id]);
                                }
                            }
                        }
                        var loadedCount = parseInt(data.count);
                        var hasMore = loadedCount == 24;
                        console.log(new Date().toString(), '[getRawByPage]success!offset=' + offset +
                        ',count=' + 24 + ',returnCount=' + loadedCount + ',returnExts=' + data.exts);
                        if (callback) {
                            callback(data.exts, hasMore);
                        }
                    },
                    error: function(xmlHttpRequest, textStatus, errorThrown) {
                        console.log(new Date().toString(), '[getRawByPage]error!' + errorThrown.toString());
                        if (callback) {
                            callback(null, true);
                        }
                    }
                });
            },
            search : function(keyword, callback) {
                var offset = $.ShanFox.data.rawExtension.length;
                $.ajax({
                    url: 'ext/search',
                    type: 'GET',
                    contentType: 'application/json; charset=utf-8',
                    dataType: 'json',
                    data: {
                        keyword: keyword
                    },
                    success: function (data) {
                        if (data.result && data.result.length > 0) {
                            for (var i = 0; i < data.result.length; i++) {
                                if (!$.ShanFox.data.allExtension[data.result[i].id]) {
                                    // cache new extension data
                                    $.ShanFox.data.allExtension[data.result[i].id] = data.result[i];
                                } else {
                                    // update local extension data
                                    for(var property in data.result[i]) {
                                        $.ShanFox.data.allExtension[data.result[i].id][property] = data.result[i][property];
                                    }
                                }
                            }
                        }
                        if (callback) {
                            callback(data.result);
                        }
                    },
                    error: function (xmlHttpRequest, textStatus, errorThrown) {
                        console.log(new Date().toString(), '[getRawByPage]error!' + errorThrown.toString());
                        if (callback) {
                            callback(null);
                        }
                    }
                });
            },
            addTag : function(extId, tag, force, callback) {
                $.ajax({
                    url: 'ext/addTag',
                    type: 'POST',
                    data: {ext : extId, tag : tag, force : force},
                    success: function(data, textStatus, xhr) {
                        var result = data && data.result;
                        var rawChange = false;
                        if (result) {
                            var ext = $.ShanFox.data.allExtension[extId];
                            if (ext) {
                                if (!ext.tag || ext.tag.length === 0) {
                                    // TODO refresh raw size and rawList
                                    rawChange = true;
                                }
                                if (ext.tag) {
                                    ext.tag.push(tag);
                                } else {
                                    ext.tag.push = [tag];
                                }
                            }
                        }
                        if (callback) {
                            callback(result, rawChange);
                        }
                    },
                    error: function(xmlHttpRequest, textStatus, errorThrown) {
                        console.log(new Date().toString(), '[extension.addTag]error!' + errorThrown.toString());
                        if (callback) {
                            callback(false);
                        }
                    }
                });
            },
            removeTag : function(extId, tag, force, callback) {
                $.ajax({
                    url: 'ext/removeTag',
                    type: 'POST',
                    data: {ext : extId, tag : tag, force : force},
                    success: function(data, textStatus, xhr) {
                        var result = data && data.result;
                        var rawChange = false;
                        if (result) {
                            var ext = $.ShanFox.data.allExtension[extId];
                            if (ext) {
                                var index = ext.tag.indexOf(tag);
                                if (index != -1) {
                                    ext.tag.splice(index, 1);
                                    if (ext.tag.length === 0) {
                                        // TODO refresh raw size and rawList
                                        rawChange = true;
                                    }
                                }
                            }
                        }
                        if (callback) {
                            callback(result, rawChange);
                        }
                    },
                    error: function(xmlHttpRequest, textStatus, errorThrown) {
                        console.log(new Date().toString(), '[extension.removeTag]error!' + errorThrown.toString());
                        if (callback) {
                            callback(false);
                        }
                    }
                });
            }
        }
    },
    ui : {
        currentContent : 0,// 0表示扩展，1表示扩展市场
        currentTag: null,// 当前选中的表情
        currentMarket : null,// 当前选中的市场
        cacheRawClear : false,// 标识空标签的扩展数据缓存失效，需要重新向服务器请求
        cacheTagClear : {}, // 标识有标签的扩展数据缓存失效，需要重新向服务器请求
        shiftPress : false,
        template : {
            extensionContent: 'views/partials/content-extension.ejs',
            marketContent: 'views/partials/content-market.ejs',
            extItem : 'views/partials/item-extension.ejs',
            extItemTags : 'views/partials/item-extension-tags.ejs',
            tagItem : 'views/partials/item-tag.ejs',
            extDetail : 'views/partials/detail-extension.ejs',
            extDetailTags : 'views/partials/detail-tags.ejs',
            loading : 'views/partials/list-loading.ejs'
        },

        // ========================== ui widget [start] ========================== //
        tagList : null,
        rawList : null,// 无标签的扩展列表
        extensionList : {},// 每个标签都有一个列表 {tagName : ExpandListView}
        searchList : null,// 搜索结果的扩展列表
        marketIFrame : null,
        // ========================== ui widget [end] ========================== //

        // ========================== ui function [start] ========================== //
        clearLocalCache : function(tag) {
            var cacheClear = tag ? $.ShanFox.ui.cacheTagClear[tag] : $.ShanFox.ui.cacheRawClear;
            if (cacheClear) {
                if (tag) {
                    $.ShanFox.ui.cacheTagClear[tag] = false;
                } else {
                    $.ShanFox.ui.cacheRawClear = false;
                }
                if (!tag) {
                    // 当前标签不是‘空标签’，则清空‘空标签’集合，等下次切换到‘空标签’时刷新
                    for (var i = 0; i < $.ShanFox.data.rawExtension.length; i++) {
                        delete $.ShanFox.data.allExtension[$.ShanFox.data.rawExtension[i].id];
                    }
                    $.ShanFox.data.rawExtension = [];
                } else {
                    if ($.ShanFox.data.taggedExtension[tag]) {
                        // 当前标签不是‘指定标签’，则清空‘指定标签’的集合，等下次切换到‘指定标签’时刷新
                        for (var i = 0; i < $.ShanFox.data.taggedExtension[tag].length; i++) {
                            delete $.ShanFox.data.allExtension[$.ShanFox.data.taggedExtension[tag][i].id];
                        }
                        $.ShanFox.data.taggedExtension[tag] = null;
                    }
                }
                // 让列表控件能滚动到底部加载更多
                if ($.ShanFox.ui.rawList) {
                    $.ShanFox.ui.rawList.more = true;
                }
                for (var tag2 in $.ShanFox.ui.extensionList) {
                    $.ShanFox.ui.extensionList[tag2].more = true;
                }
            }
        },
        clearLocalCacheLazy : function(tag) {
            // 设置待清除缓存标识
            if (tag) {
                $.ShanFox.ui.cacheTagClear[tag] = true;
            } else {
                $.ShanFox.ui.cacheRawClear = true;
            }
            // 如果当前标签不是指定标签，则立即清除缓存
            if ($.ShanFox.ui.currentTag !== tag) {
                $.ShanFox.ui.clearLocalCache(tag);
            }
        },
        clearScrollListener : function() {
            for (var tag in $.ShanFox.ui.extensionList) {
                $.ShanFox.ui.extensionList[tag].unregisterScrollListener();
            }
            if ($.ShanFox.ui.rawList) {
                $.ShanFox.ui.rawList.unregisterScrollListener();
            }
        },
        clearAllListener : function() {
            $.ShanFox.ui.clearScrollListener();
            if ($.ShanFox.ui.marketIFrame) {
                $.ShanFox.ui.marketIFrame.unregisterResizeListener();
            }
        },
        clearLeftMenuActive : function() {
            $('#left-ext').removeClass('active');
            $('#left-market').removeClass('active');
            $('#left-market-menu').children().removeClass('active');
        },
        createExtensionList : function(loadMoreFn) {
            var itemTagsInit = function(data, itemView) {
                var tagList = data.tag;
                var lis = itemView.find('li');
                for (var i = 0; i < lis.length; i++) {
                    var deleteBtn = $(lis[i]).find('.btn');
                    deleteBtn.click(tagList[i], function(event) {
                        event.preventDefault();
                        event.stopPropagation();
                        $.ShanFox.ajax.extension.removeTag(data.id, event.data, false,
                            function(result, rawChange) {
                                if (result) {
                                    listView.refreshPartOfItem(data);
                                    $.ShanFox.ui.showTagList(true);
                                    $.ShanFox.ui.clearLocalCacheLazy(event.data);
                                    if (rawChange) {
                                        $.ShanFox.ui.clearLocalCacheLazy(null);
                                    }
                                } else {
                                    alert('给扩展[' + data.name + ']添加标签[' + event.data + ']失败!');
                                }
                            });
                    });
                }
            };
            var listView = null;
            var option = {
                parentSelector : '#ext-list',
                loadingSelector : '#list-loading',
                itemTemplate : $.ShanFox.ui.template.extItem,
                loadingTemplate : $.ShanFox.ui.template.loading,
                loadingWord : 'loading...',
                colCount : 4,
                loadMoreFn : loadMoreFn,
                refreshPartCallback : function(data, itemView) {
                    var tagsBox = itemView.find('.btn-group');
                    var tagsContent = ejs.renderFile($.ShanFox.ui.template.extItemTags, data, {cache:true});
                    tagsBox.html(tagsContent);
                    itemTagsInit(data, itemView);
                },
                itemCallback : function(data, itemView) {
                    // init description appear when hover
                    var bg = itemView.find('.widget-user-header');
                    $(bg).hover(
                        function() {
                            var cover = $(this).children();
                            cover.stop().animate({opacity: '1'},500);
                        },
                        function() {
                            var cover = $(this).children();
                            cover.stop().animate({opacity: '0'},500);
                        });
                    // init click
                    bg.click(function(event) {
                        event.preventDefault();
                        event.stopPropagation();
                        $.ShanFox.ui.showExtensionDetail(data, listView);
                    });
                    // init tags in extension
                    itemTagsInit(data, itemView);
                },
                droppable : true,
                droppable_hover : 'bg-gray-active',
                droppable_drop : function(draggableElement, droppableElement, data) {
                    var dragTag = draggableElement.data('data');
                    var extTags = data.tag ? data.tag : [];
                    if (extTags.indexOf(dragTag) != -1) {
                        // tag exist, cannot add again!
                        //alert('扩展[' + data.name + ']已包含标签[' + tag + ']，不可重复添加!');
                        shake(droppableElement, 6, 10, 100);
                        var btn = droppableElement.find('.btn-group');
                        btn.removeClass('open');
                    } else {
                        var extId = data.id;
                        $.ShanFox.ajax.extension.addTag(extId, dragTag, false,
                            function(result, rawChange) {
                                if (result) {
                                    listView.refreshPartOfItem(data);
                                    if (!$.ShanFox.ui.shiftPress) {// 按住shift,连续添加
                                        $.ShanFox.ui.showTagList(true);
                                        $.ShanFox.ui.clearLocalCacheLazy(dragTag);
                                        if (rawChange) {
                                            $.ShanFox.ui.clearLocalCacheLazy(null);
                                        }
                                    }
                                } else {
                                    alert('给扩展[' + data.name + ']添加标签[' + dragTag + ']失败!');
                                }
                            });
                    }
                },
                droppable_over : function(draggableElement, droppableElement, data) {
                    var btn = droppableElement.find('.btn-group');
                    btn.addClass('open');
                    if ($.ShanFox.ui.shiftPress) {// 按住shift,连续添加
                        option.droppable_drop(draggableElement, droppableElement, data);
                    }
                },
                droppable_out : function(draggableElement, droppableElement, data) {
                    var btn = droppableElement.find('.btn-group');
                    btn.removeClass('open');
                }
            };
            listView = new ExpandListView(option);
            return listView;
        },
        switchTag : function(tag) {
            $.ShanFox.ui.currentTag = tag;
            // 检查是否要清空缓存
            var cacheClear = tag ? $.ShanFox.ui.cacheTagClear[tag] : $.ShanFox.ui.cacheRawClear;
            if (cacheClear) {
                $.ShanFox.ui.clearLocalCache(tag);
            }

            $.ShanFox.ui.clearScrollListener();
            if (!tag) {
                $('#header-selected-tag').html('空标签(请拖动标签到扩展里以添加)'
                + '  <small>共' + $.ShanFox.data.rawExtSize + '个</small>');
            } else {
                $('#header-selected-tag').html(tag + '  <small>共' + $.ShanFox.data.tags[tag].size + '个</small>');
            }
            var listView = tag ? $.ShanFox.ui.extensionList[tag] : $.ShanFox.ui.rawList;
            var dataList = tag ? $.ShanFox.data.taggedExtension[tag] : $.ShanFox.data.rawExtension;
            if (!listView) {// new taggList for [tag]
                listView = $.ShanFox.ui.createExtensionList(tag ?
                    $.ShanFox.ajax.extension.getTaggedByPage : $.ShanFox.ajax.extension.getRawByPage);
                if (tag) {
                    $.ShanFox.ui.extensionList[tag] = listView;
                } else {
                    $.ShanFox.ui.rawList = listView;
                }
            }
            listView.registerScrollListener();
            listView.clear();
            if (!dataList || dataList.length == 0) {
                listView.loadMore();
            } else {
                listView.render(dataList);
            }
        },
        showSearchResult : function(keyword, result) {
            // clear global listener
            $.ShanFox.ui.clearScrollListener();
            $('#header-selected-tag').html('搜索"' + keyword + '"的结果<small>共' + result.length + '个</small>');
            if (!$.ShanFox.ui.searchList) {
                $.ShanFox.ui.searchList = $.ShanFox.ui.createExtensionList();
            }
            $.ShanFox.ui.searchList.clear();
            $.ShanFox.ui.searchList.render(result);
        },
        showTagList : function(forceRefresh, callback) {
            if (!$.ShanFox.data.tags || forceRefresh) {
                // no tags data, request
                $.ShanFox.ajax.tag.getAll(function(tags) {
                    $('#tag-raw-size').text($.ShanFox.data.rawExtSize);
                    $.ShanFox.ui.tagList.render($.ShanFox.data.tags);
                    if (callback) {
                        callback(true);
                    }
                });
            } else {
                $('#tag-raw-size').text($.ShanFox.data.rawExtSize);
                $.ShanFox.ui.tagList.render($.ShanFox.data.tags);
                if (callback) {
                    callback(false);
                }
            }
        },
        showExtensionList : function() {
            $.ShanFox.ui.currentContent = 0;
            // left menu
            $.ShanFox.ui.clearLeftMenuActive();
            $('#left-ext').addClass('active');
            // clear global listener
            $.ShanFox.ui.clearAllListener();
            // ejs template to html
            var html = ejs.renderFile($.ShanFox.ui.template.extensionContent, $.ShanFox.data.ejs, {cache:true});
            $('#page-right-content').html(html);
            // init extension list
            if (!$.ShanFox.ui.tagList) {
                $.ShanFox.ui.tagList = new EditableListView({
                    parentSelector : '#tag-list',
                    inputSelector : '#tag-input',
                    inputCollapseSelector : '#tag-input-collapse',
                    itemDeleteSelector: 'button',
                    itemTemplate : $.ShanFox.ui.template.tagItem,
                    addFn : function(inputTag, callback) {
                        $.ShanFox.ajax.tag.add(inputTag, function(result) {
                            if (result) {
                                // render new tagList
                                callback($.ShanFox.data.tags)
                            } else {
                                alert('添加标签[' + inputTag + ']失败!');
                                // render new tagList
                                callback(null);
                            }
                        });
                    },
                    removeFn : function (tag, callback) {
                        $.ShanFox.ajax.tag.remove(tag, function(result, rawChange) {
                            if (result) {
                                if (rawChange) {
                                    // force refresh tag list
                                    $.ShanFox.ajax.tag.getAll(function(tags) {
                                        // remove extensionList for [tag]
                                        delete $.ShanFox.ui.extensionList[tag];
                                        // if currentTag is removed. switch to another tag
                                        if ($.ShanFox.ui.currentTag === tag) {
                                            var nextTag = null;
                                            for (var t in $.ShanFox.data.tags) {
                                                nextTag = t;
                                                break;
                                            }
                                            $.ShanFox.ui.switchTag(nextTag);
                                        }
                                        $('#tag-raw-size').text($.ShanFox.data.rawExtSize);
                                        // refresh tagList
                                        callback(result);
                                    });
                                } else {
                                    // remove extensionList for [tag]
                                    delete $.ShanFox.ui.extensionList[tag];
                                    // if currentTag is removed. switch to another tag
                                    if ($.ShanFox.ui.currentTag === tag) {
                                        var nextTag = null;
                                        for (var t in $.ShanFox.data.tags) {
                                            nextTag = t;
                                            break;
                                        }
                                        $.ShanFox.ui.switchTag(nextTag);
                                    }
                                    // refresh tagList
                                    callback(result);
                                }
                            } else {
                                alert('删除标签[' + tag + ']失败!');
                                // refresh tagList
                                callback(result);
                            }
                        });
                    },
                    selectFn : $.ShanFox.ui.switchTag,
                    selectClass : 'sf-hover-pointer',
                    draggable : true
                });
            }
            $.ShanFox.ui.tagList.init();
            $('#tag-raw').click(function() {
                $.ShanFox.ui.switchTag(null);
            });
            $.ShanFox.ui.showTagList(false, function (refreshFromServer) {
                if (refreshFromServer) {
                    // 默认选择无标签的列表
                    $.ShanFox.ui.switchTag(null);
                } else {
                    // 从本地缓存加载，展示当前选择的标签页
                    $.ShanFox.ui.switchTag($.ShanFox.ui.currentTag);
                }
            });
        },
        showMarket : function(market) {
            $.ShanFox.ui.currentContent = 1;
            if ($.ShanFox.ui.currentMarket === market) {
                return;
            }
            $.ShanFox.ui.currentMarket = market;
            // left menu
            $.ShanFox.ui.clearLeftMenuActive();
            $('#left-market').addClass('active');
            $('#left-market-' + $.ShanFox.ui.currentMarket).addClass('active');
            // clear global listener
            $.ShanFox.ui.clearAllListener();
            // ejs template to html
            var html = ejs.renderFile($.ShanFox.ui.template.marketContent, $.ShanFox.data.ejs, {cache:true});
            $('#page-right-content').html(html);
            // init market content
            if (!$.ShanFox.ui.marketIFrame) {
                $.ShanFox.ui.marketIFrame = new FullHeightIFrame('#market-iframe', '#page-right-content', 35);
            }
            $.ShanFox.ui.marketIFrame.registerResizeListener();
            var marketUrl = $.ShanFox.data.marketUrl[$.ShanFox.ui.currentMarket];
            $.ShanFox.ui.marketIFrame.setContent(marketUrl);
        },
        showExtensionDetail : function(extension, listView) {
            var html = ejs.renderFile($.ShanFox.ui.template.extDetail,
                extension, {cache:true});
            $(document.body).append(html);
            $('#ext-detail-close-btn').click(function(event) {
                event.preventDefault();
                event.stopPropagation();
                var cover = $('#ext-detail-cover');
                cover.stop().animate({opacity: '0'},500, function() {
                    cover.remove();
                });
            });
            // auto slide
            $('#ext-detail-slider').carousel();
            // show tags of this extension
            var tags = $('#ext-detail-tags');
            $.ShanFox.ui.showDetailTags(tags, extension, listView);
            // 按回车确认添加
            var addTagBox = $('#ext-detail-add-tag');
            var boxCollapse = addTagBox.find('.box-header');
            var inputComponent = addTagBox.find('input');
            // 输入框监听按键
            inputComponent.keydown(function(event) {
                switch (event.which) {
                    case 13:
                        var inputTag = inputComponent.val();
                        if (!inputTag) {// cannot input empty tag
                            shake(addTagBox, 6, 10, 100);
                        } else {
                            $.ShanFox.ajax.extension.addTag(extension.id, inputTag, true,
                                function(result, rawChange) {
                                    if (result) {
                                        inputComponent.val('');// 清空
                                        $.ShanFox.ui.showDetailTags(tags, extension, listView);// refresh item
                                        listView.refreshPartOfItem(extension);
                                        $.ShanFox.ui.showTagList(true);
                                        $.ShanFox.ui.clearLocalCacheLazy(inputTag);
                                        if (rawChange) {
                                            $.ShanFox.ui.clearLocalCacheLazy(null);
                                        }
                                    } else {
                                        shake(addTagBox, 6, 10, 100);
                                    }
                                });
                        }
                        break;
                    case 27:
                    case 53:
                        boxCollapse.click();
                        break;
                }
            });
            // 输入框的自动匹配
            inputComponent.autocomplete({
                lookup: $.ShanFox.data.tagArray
            });
            var cover = $('#ext-detail-cover');
            cover.click(function(event){
                if (event.target === event.currentTarget) {
                    event.preventDefault();
                    event.stopPropagation();
                    var cover = $('#ext-detail-cover');
                    cover.stop().animate({opacity: '0'},500, function() {
                        cover.remove();
                    });
                }
            });
            cover.animate({opacity: '1'},500);
        },
        showDetailTags: function(parent, extension, listView) {
            if (!parent) {
                return;
            }
            var html = ejs.renderFile($.ShanFox.ui.template.extDetailTags,
                extension, {cache:true});
            parent.html(html);
            // init tag deleteBtn
            var lis = parent.find('.label-default');
            for (var i = 0; i < lis.length; i++) {
                var deleteBtn = $(lis[i]).find('.fa-trash');
                deleteBtn.click(extension.tag[i], function(event) {
                    event.preventDefault();
                    event.stopPropagation();
                    $.ShanFox.ajax.extension.removeTag(extension.id, event.data, true,
                        function(result, rawChange) {
                            if (result) {
                                // refresh item
                                $.ShanFox.ui.showDetailTags(parent, extension, listView);
                                if (listView) {
                                    listView.refreshPartOfItem(extension);
                                }
                                $.ShanFox.ui.showTagList(true);
                                $.ShanFox.ui.clearLocalCacheLazy(event.data);
                                if (rawChange) {
                                    $.ShanFox.ui.clearLocalCacheLazy(null);
                                }
                            } else {
                                alert('给扩展[' + extension.name + ']添加标签[' + event.data + ']失败!');
                            }
                        });
                });
            }
        }
        // ========================== ui function [end] ========================== //
    }
};


// ========================== init logic [start] ========================== //
$(function () {
    $(document).keydown(function(event) {
        switch (event.which) {
            case 16:
                console.log(new Date().toString(), 'key down shift!');
                $.ShanFox.ui.shiftPress = true;
                break;
        }
    });
    $(document).keyup(function(event) {
        switch (event.which) {
            case 16:
                console.log(new Date().toString(), 'key up shift!');
                $.ShanFox.ui.shiftPress = false;
                break;
        }
    });
    // 输入框监听按键
    $('#left-search-input').keydown(function(event) {
        switch (event.which) {
            case 13:
                $('#left-search-btn').click();
                break;
        }
    });
    $('#left-search-btn').click(function() {
        if ($.ShanFox.ui.currentContent !== 0) {
            shake($('#left-search'), 6, 10, 100);
            return;
        }
        var inputComponent = $('#left-search-input');
        var inputContent = inputComponent.val();
        if (!inputContent) {
            shake($('#left-search'), 6, 10, 100);
            return;
        }
        inputComponent.val('');// 清空
        $.ShanFox.ajax.extension.search(inputContent, function(result) {
            $.ShanFox.ui.showSearchResult(inputContent, result);
        });
    });
    $('#left-market-chrome').click(function(){
        $.ShanFox.ui.showMarket('chrome');
    });
    $('#left-market-baidu').click(function(){
        $.ShanFox.ui.showMarket('baidu');
    });
    $('#left-market-sougou').click(function(){
        $.ShanFox.ui.showMarket('sougou');
    });
    $('#left-market-360jisu').click(function(){
        $.ShanFox.ui.showMarket('360jisu');
    });
    $('#left-market-360anquan').click(function(){
        $.ShanFox.ui.showMarket('360anquan');
    });
    $('#left-market-liebao').click(function(){
        $.ShanFox.ui.showMarket('liebao');
    });
    $('#left-market-uc').click(function(){
        $.ShanFox.ui.showMarket('uc');
    });
    var extensionMenu = $('#left-ext');
    extensionMenu.click(function(){
        if ($.ShanFox.ui.currentContent !== 0) {
            $.ShanFox.ui.showExtensionList();
        }
    });
    // default show extension
    $.ShanFox.ui.showExtensionList();
});
// ========================== init logic [end] ========================== //

