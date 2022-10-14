ko.bindingHandlers.hidden = {
    update: function(element, valueAccessor) {
        ko.bindingHandlers.visible.update(element, function() {
            return !ko.utils.unwrapObservable(valueAccessor());
        });
    }
}
ko.bindingHandlers.preventBubble = {
    init: function (element, valueAccessor) {
        var eventName = ko.utils.unwrapObservable(valueAccessor());
        ko.utils.registerEventHandler(element, eventName, function (event) {
            event.cancelBubble = true;
            if (event.stopPropagation) {
                event.stopPropagation();
            }
        });
    }
};

ko.bindingHandlers.dialog = {
    init: function (element, valueAccessor, allBindings, bindingContext) {
        var $element = $(element),
            commands = {};

        var defaultConfig = {
            modal: true,
        };

        commands = parseCommands(allBindings());
        var value = typeof valueAccessor === "function" ? valueAccessor() : valueAccessor;
        var config = buildConfiguration(allBindings());
        $element.dialog(config);
        var dialogDestroyed = false;

        if (ko.isObservable(value)) {
            var valueSubscriber = value.subscribe(function (val) {
                if (val == undefined) ko.cleanNode(element);
                else if(!dialogDestroyed) $element.dialog(val ? "open" : "close");
            });

            ko.utils.domNodeDisposal.addDisposeCallback(element, function () {
                if($element.dialog('option')) $element.dialog("destroy");
                dialogDestroyed = true;
                valueSubscriber.dispose && valueSubscriber.dispose();
            });
        }

        attachKoCommands($element, commands);
        ko.bindingHandlers.cancelKey.init(element, ko.utils.wrapAccessor(function () {
            if (commands['Cancel']) commands['Cancel'].execute();
            else $element.dialog('close');
        }));
        
        function buildConfiguration(bindings) {
            var modal = bindings.modal || defaultConfig.modal;

            // Creates empty function for any configured buttons. 
            // This will cause the buttons to be displayed while allowing
            // execution to be deferred to the supplied command object.

            var config = {
                modal: modal,
                height: bindings.height || defaultConfig.height,
                width: bindings.width || defaultConfig.width,
                position: bindings.position || defaultConfig.position,
                buttons: {
                    Ok: bindings.okCommand ? function() {} : undefined,
                    Cancel: bindings.cancelCommand ? function() {} : undefined,
                },
                close: bindings.close || bindings.cancelCommand,
                title: ko.utils.unwrapObservable(bindings.title),
                autoOpen: ko.utils.unwrapObservable(value) && true || false,
                dialogClass: bindings.cancelCommand ? 'no-close' : '',
            };

            if (bindings.customCommands) {
                var customCommands = getCustomCommands(bindings);
                ko.utils.arrayForEach(customCommands, function (command) {
                    for (var prop in command) {
                        config.buttons[prop] = empty;
                    }
                });
            }

            function empty() {}

            return config;
        }

        function getCustomCommands(bindings) {
            var customCommands = bindings.customCommands || [];
            if (customCommands.length == undefined) {
                var temp = customCommands;
                customCommands = [];
                customCommands.push(temp);
            }
            return customCommands;
        }

        function parseCommands(bindings) {
            bindings = bindings || {};
            var commands = {};
            commands = parseCommand(bindings, 'cancelCommand', commands, 'Cancel');
            commands = parseCommand(bindings, 'okCommand', commands, 'Ok');

            var customCommands = getCustomCommands(bindings);
            $.each(customCommands, function (index) {
                for (var cmdName in customCommands[index]) {
                    commands = parseCommand(customCommands[index], cmdName, commands);
                }
            });
            return commands;
        }

        function parseCommand(bindings, bindingName, commandBindings, mapToCommandName) {
            mapToCommandName = mapToCommandName || bindingName;
            if (bindings[bindingName]) {
                var cmd = bindings[bindingName];
                if (cmd.execute == undefined) {
                    cmd = ko.command({
                        execute: cmd
                    });
                }
                commandBindings[mapToCommandName] = cmd;
            }
            return commandBindings;
        }

        function attachKoCommands($e, commands) {
            var buttonFunctions = $e.dialog("option", "buttons");
            var newButtonsConfig = [];
            for (var funcName in buttonFunctions) {
                for (var cmdName in commands) {
                    if (cmdName == funcName) {
                        //todo: replace contains with eq? 
                        var buttons = $(".ui-dialog-buttonpane button:contains('" + cmdName + "')");

                        $.each(buttons, function (index) {
                            var command = commands[cmdName];

                            ko.bindingHandlers.command.init(
                                buttons[index],
                                ko.utils.wrapAccessor(command),
                                allBindings,
                                bindingContext);

                            // remove click functionality from the jQuery UI element
                            newButtonsConfig.push({
                                text: cmdName,
                                click: empty,
                            });
                        });
                        break;
                    }
                }
            }

            function empty() {}
        }
    }
};

ko.bindingHandlers.cancelKey = {
    init: function (element, valueAccessor, allBindings, viewModel) {
        var delegate = ko.utils.unwrapObservable(valueAccessor());

        if (delegate && typeof delegate !== 'function' && typeof delegate.execute === "function") {
            delegate = delegate.execute;
        }
        if (delegate == undefined) return;

        var cancelKeyCode = 27;
        var elementToRegister = element;

        if (attachToWindow()) {
            var conditionFn = function () { return $(element).is(':visible'); };
            elementToRegister = window;
        }
        ko.utils.registerEventHandler(elementToRegister, 'keydown', buildEventHandler(conditionFn));
        
        function attachToWindow() {
            var bindings = ko.utils.unwrapObservable(allBindings);
            return bindings && ko.utils.unwrapObservable(bindings.attachToWindow) === true;
        }

        function buildEventHandler(conditionalFn) {
            conditionalFn = conditionalFn || function() { return true; };
            return function (event) {
                if (event.keyCode == cancelKeyCode && conditionalFn()) {
                    executeCancel(event);
                    event.cancelBubble = true;
                    if (event.stopPropagation) event.stopPropagation();
                }
            };
        }

        function executeCancel(event) {
            event.preventDefault();
            event.target.blur();
            delegate.call(viewModel);
        }
    }
};

ko.bindingHandlers.onblur = {
    init: function(element, valueAccessor) {
        var fn = valueAccessor();
        if (fn && fn.execute) fn = commandWrapper.bind(fn);
        ko.utils.registerEventHandler(element, 'blur', fn);
        
        function commandWrapper() {
            this.execute();
        }
    }
};

ko.bindingHandlers.maxHeight = {
    init: function (element, valueBinding, allBindings) {
        var $element = $(element);
        $element.addClass('maxHeight-container');
        var resize = ko.bindingHandlers.maxHeight.constrainHeight.bind($element);
        resize();
        //$('body *').scroll(resize); // this was added to catch scrolling events on the popupWindow and should be done more efficiently
        $(window).scroll(resize);

        // display full container when the user starts to scroll content
        var lastScrollTop = 0; 
        $element.scroll(function () {
            var scrollTop = $element.scrollTop();
            if (respondToScroll()) {
                var offset = $element.offset();
                // warning: this will not work correctly with popupWindow because of the window's scroll position which is irrelevant to the popup window - vk 1/1/2014
                if (offset.top !== $(window).scrollTop()) {
                    $('html, body').animate({
                        scrollTop: offset.top
                    });
                }
            }
            lastScrollTop = scrollTop;

            function respondToScroll() {
                return scrollTop !== lastScrollTop;
            }
        });


        ko.bindingHandlers.maxHeight.addStickyHeaderToTables($element, allBindings());
    },
    update: function (element) {
        ko.bindingHandlers.maxHeight.constrainHeight.call($(element));
    },
    constrainHeight: function() {
        var windowHeight = $(window).height();
        var top = this[0].getBoundingClientRect().top;
        var elHeight = Math.max(top, 0);
        this.css('max-height', windowHeight - elHeight);
        this.css('overflow-y', 'scroll');
        this.css('overflow-x', 'scroll');
    },
    addStickyHeaderToTables: function (element, allBindings) {
        var $element = $(element);
        var opts = allBindings || {};

        var template = getTemplatedChild();
        if (template) {
            if (!allBindings.stickyTableHeaders) return; 
            var value = ko.utils.wrapAccessor(allBindings.stickyTableHeaders);
            opts.dependsOn = template;
            var bindings = ko.utils.wrapAccessor(opts);
            ko.bindingHandlers.stickyTableHeaders.init(template, value, bindings);
        } else {
            opts.parent = $element;
            $element.find(allBindings.stickyTableHeaders || 'table').each(function () {
                var $this = $(this);
                ko.bindingHandlers.stickyTableHeaders.init($this, ko.utils.wrapAccessor(true), ko.utils.wrapAccessor(opts));
                removeStickyTableBinding($this);
            });
        }
        
        function getTemplatedChild() {
            var child = getChild();
            if (!child) return null;
            var childContext = ko.contextFor(child);
            if (!childContext) return null;

            var childBindings = ko.bindingProvider.instance.getBindings(child, childContext);
            return childBindings && childBindings.template
                ? child : null;

            function getChild() {
                return $element.children(':first')[0]
                    || getVirtualElementChild();
            }
            function getVirtualElementChild() {
                var vChild = ko.virtualElements.firstChild($element[0]);
                return vChild && ko.virtualElements.nextSibling(vChild);
            }
        }

        function removeStickyTableBinding(table) {
            var dataBind = table.attr('data-bind');
            if (dataBind) {
                dataBind = dataBind.replace(/stickyTableHeaders\:\s?\w+\W?\s?/, "");
                table.attr('data-bind', dataBind);
            }
        }
    }
};

ko.bindingHandlers.fixCvpOverlay = {
    init: function (element, valueAccessor) {
        var $container = $(element).wrap('<div />').parent();
        //ko.bindingHandlers.fixCvpOverlay.update(element,valueAccessor);
    },
    update: function (element, valueAccessor) {
        valueAccessor().notifySubscribers(); // fix initial overlay
        ko.utils.unwrapObservable(valueAccessor());
        var $cvp = $("#cvp");
        var cvpWidth = $cvp.outerWidth();
        var $element = $(element);
        var inventoryTableWidth = $element.width();

        // When element contains an enumerated child (such as a foreach binding), the
        // width function returns 0. This hacky little fix will set a default width.
        if (inventoryTableWidth == 0) {
            inventoryTableWidth = 5000; // default width
        }

        var $container = $element.parent();
        $container.width(inventoryTableWidth).css({ "padding-right": cvpWidth + 85 });
    }
};

ko.bindingHandlers.undo = {
    init: function (element, valueAccessor, allBindings, viewModel) {
        var bindings = {};
        var trackedBindingNames = ['value'];
        var isEditing = ko.computed(function () {
            return ko.utils.unwrapObservable(valueAccessor());
        });
        var elementBindings = ko.bindingProvider.instance.getBindings(element, ko.contextFor(element));
        ko.utils.arrayForEach(trackedBindingNames, function (binding) {
            if (elementBindings[binding]) {
                bindings[binding] = elementBindings[binding];
            }
        });

        for (var boundProp in bindings) {
            initializeTracking(bindings[boundProp]);
        }

        function revert(propAccessor) {
            var initalValue = propAccessor.changeHistory()[0];
            propAccessor(initalValue);
        }

        function initializeTracking(propAccessor) {
            propAccessor.changeHistory = ko.observableArray([propAccessor()]);

            propAccessor.subscribe(function (newVal) {
                propAccessor.changeHistory.push(newVal);
            });

            setupRevertTrigger(propAccessor);
        }

        isEditing.subscribe(function (newVal) {
            $cancelButton.each(function (index, button) {
                ko.bindingHandlers.visible.update(
                    button,
                    ko.utils.wrapAccessor(newVal),
                    allBindings,
                    data
                );
            });
        });

        function setupRevertTrigger(propAccessor) {
            // eventually, we'll enable actual undo/redo stepping but for now, we just 
            // handle both as a revert function.
            var revertCommand = ko.command({
                execute: function () {
                    revert(propAccessor);
                },
                canExecute: function () {
                    return propAccessor.changeHistory().length > 1;
                }
            });
            propAccessor.revertCommand = revertCommand;
            var trigger = allBindings().undoTrigger || allBindings().revertTrigger;

            $(trigger).each(function (index, button) {
                ko.bindingHandlers.command.init(
                    button,
                    ko.utils.wrapAccessor(revertCommand),
                    allBindings,
                    viewModel
                );
            });
        }
    }
};

ko.bindingHandlers.pageData = {
    update: function (element, valueAccessor) {
        ko.utils.unwrapObservable(valueAccessor());
        $(element).hide().fadeIn(500);
    }
};

ko.bindingHandlers.editableContent = {
    init: function (element, valueAccessor, allBindings, data) {
        var savedState = ko.observable();
        var isEditing = ko.computed(function () {
            return ko.utils.unwrapObservable(valueAccessor());
        });
        var $element = $(element);
        var $cancelButton = $(allBindings().cancelTrigger);
        var $masterCancelButton = $(allBindings().masterCancelTrigger);

        if (!isEditing()) { $element.attr("readonly", "readonly"); }

        ko.bindingHandlers.undo.init(
            element,
            ko.utils.wrapAccessor(function () { return true; }),
            ko.utils.wrapAccessor({ revertTrigger: $cancelButton ? $cancelButton[0] : undefined }),
            data);

        ko.bindingHandlers.click.init(
            element,
            ko.utils.wrapAccessor(beginEdit),
            ko.utils.wrapAccessor({}),
            data);

        //todo: handle blur events (and allow disabling the blur handlers)

        //todo: 1. prevent bubbling, 2. enable canceling when cancel button is not supplied
        ko.bindingHandlers.cancelKey.init(
            element,
            ko.utils.wrapAccessor(function () { $cancelButton.click(); }),
            ko.utils.wrapAccessor({ keydownBubble: false }),
            data
        );


        setupCancelButtons();

        function setupCancelButtons() {
            var cancelCommand = allBindings().cancelEditsCommand;
            if ($cancelButton.length > 0) {
                $cancelButton.each(function (index, button) {
                    ko.bindingHandlers.command.init(
                        button,
                        ko.utils.wrapAccessor(cancelCommand),
                        function () { return { clickBubble: false }; },
                        data);
                });
            }

            $masterCancelButton.each(function (index, button) {
                var context = ko.contextFor(button);
                if (context) {
                    var commandBinding = ko.bindingProvider.instance.getBindings(button, context).command;
                    if (commandBinding) {
                        if (typeof commandBinding.addCommand != "function") {
                            throw new Error('The masterCancelCommand is only supported with a composableCommand instance.');
                        }

                        commandBinding.addCommand(ko.command({
                            execute: function () { $cancelButton.click(); }
                        }));
                    }
                }
            });
        }

        function beginEdit() {
            if (isEditing()) return;
            valueAccessor()(true);
            var bindings = ko.bindingProvider.instance.getBindings(element, ko.contextFor(element));
            savedState(ko.utils.unwrapObservable(bindings.value));
        }
    },
    update: function (element, valueAccessor) {
        var isEditing = ko.utils.unwrapObservable(valueAccessor());
        if (isEditing === false) {
            $(element).attr("readonly", "readonly");
        } else {
            $(element).removeAttr("readonly");
        }
    }
};

ko.bindingHandlers.editableContentArea = {
    init: function (element, valueAccessor, allBindings, data) {
        var $element = $(element);
        var isEditing = ko.computed(function () {
            return ko.utils.unwrapObservable(valueAccessor());
        });

        function setIsEditingValue(val) {
            valueAccessor()(val);
        }
        var inputElements = $('input', $element).not('[type="button"], [type="submit"]');
        var allChildrenEmpty = ko.computed(function () {
            var firstDefinedValue = ko.utils.arrayFirst(inputElements, function (e) {
                var ctx = ko.contextFor(e);
                var binding = ctx ? ko.bindingProvider.instance.getBindings(e, ctx) : undefined;
                var value = binding ? binding.value() : undefined;
                return value != undefined;
            });
            return firstDefinedValue === null;
        });
        var isCancelVisible = ko.computed(function () {
            return isEditing() && !allChildrenEmpty();
        });

        valueAccessor().__editableContentArea__inputElements = inputElements;

        var cancelValueAccessor = ko.utils.wrapAccessor(function () { return false; });
        cancelValueAccessor().__editableContentArea__inputElements = inputElements;

        var cancelCommand = ko.command({
            execute: function () {
                setIsEditingValue(false);
            },
        });

        // currently requires cancelTrigger binding to be provided
        var $cancelButton = $element.find(allBindings().cancelTrigger);

        // initialize visibility
        updateCancelButtonVisibility();

        // update visibility
        isCancelVisible.subscribe(function () {
            updateCancelButtonVisibility();
        });

        allBindings().cancelTrigger = $cancelButton ? $cancelButton[0] : undefined;
        allBindings().cancelEditsCommand = cancelCommand;

        $.each(inputElements, function (index, elem) {
            ko.bindingHandlers.editableContent.init(elem, valueAccessor, allBindings, data);
        });

        function updateCancelButtonVisibility() {
            $cancelButton.each(function (index, button) {
                ko.bindingHandlers.visible.update(
                    button,
                    function () { return isCancelVisible(); },
                    allBindings,
                    data
                );
            });
        }
    },
    update: function (element, valueAccessor, allBindings, data) {
        var inputElements = valueAccessor().__editableContentArea__inputElements;
        var isEditing = ko.utils.unwrapObservable(valueAccessor());

        $.each(inputElements, function (index, elem) {
            ko.bindingHandlers.editableContent.update(
                elem,
                ko.utils.wrapAccessor(isEditing),
                allBindings,
                data
            );
        });
    },
};

ko.bindingHandlers.slideVisible = {
    init: function (element, valueAccessor) {
        var display = ko.utils.unwrapObservable(valueAccessor());
        if (display) {
            $(element).hide();
            $(element).slideDown();
        } else {
            $(element).slideUp();
        }
    },
    update: function (element, valueAccessor, allBindings) {
        var display = ko.utils.unwrapObservable(valueAccessor());
        var defaults = {
            showDuration: "slow",
            hideDuration: "slow",
            speed: false,
            direction: "down",
        };
        var options = $.extend(defaults, allBindings());
        if (options.speed) options.showDuration = options.hideDuration = options.speed;

        if (display) {
            $(element).slideDown(options.showDuration);
        } else {
            $(element).slideUp(options.hideDuration);
        }
    }
};

ko.bindingHandlers.popup = {
    init: function(element, valueAccessor, allBindings) {
        var $element = $(element);
        $element.addClass('popupWindow');

        var defaults = {
            attachCancelCommandToWindow: true,
        };
        var options = $.extend({}, defaults, allBindings());
        var borderWidth = parseInt($element.css('border-left-width'), 10) || 10; // parseInt trims the 'px' and returns base-10 value

        $(element).on('click', onCloseEvent);

        if (options.closePopupCommand) {
            var cancelKeyOptions = options;
            cancelKeyOptions.attachToWindow = options.attachCancelCommandToWindow;
            ko.bindingHandlers.cancelKey.init(element, ko.utils.wrapAccessor(options.closePopupCommand), ko.utils.wrapAccessor(cancelKeyOptions));
        }

        ko.bindingHandlers.slideIn.init(element, valueAccessor);
        
        // handle cleanup
        ko.utils.domNodeDisposal.addDisposeCallback(element, function () {
            $element.off('click', onCloseEvent);
        });
        
        // private functions
        function onCloseEvent(e) {
            var hitAreaX = borderWidth + $element.position().left;
            // Reece - Replaced pageX with screenX b/c when
            // clicking a selectBox,  pageX value is relative to 
            // selectbox -- not the page.
            if (e.pageX && e.pageX <= hitAreaX) {
                if (options.closePopupCommand && typeof options.closePopupCommand.execute == "function") {
                    options.closePopupCommand.execute();
                    return;
                }
                if (ko.isWriteableObservable(valueAccessor())) {
                    valueAccessor()(false);
                    return;
                }
                ko.bindingHandlers.popup.update(element, ko.utils.wrapAccessor(false), allBindings);
            }
        }
    },
    update: function(element, valueAccessor, allBindings) {
        ko.bindingHandlers.slideIn.update(element, valueAccessor, allBindings);
    }
};

ko.bindingHandlers.slideIn = {
    init: function (element, valueAccessor) {
        var display = ko.utils.unwrapObservable(valueAccessor());

        var $element = $(element);
        $element.show();
        if (!display) {
            $(element).css({ left: $(window).width()});
        }
    },
    update: function (element, valueAccessor) {
        var $element = $(element);
        var display = ko.utils.unwrapObservable(valueAccessor());
        if (display) $element.animate({ left: 0 });
        else $element.animate({ left: "100%" });
    }
};

ko.bindingHandlers.fadeVisible = {
    init: function (element) {
        $(element).hide();
    },
    update: function (element, valueAccessor) {
        var value = ko.utils.unwrapObservable(valueAccessor());
        if (value) $(element).fadeIn();
        else  $(element).fadeOut();
    }
};

ko.bindingHandlers.stickyTableHeaders = {
    init: function (element, valueAccessor, allBindings) {
        var value = ko.utils.unwrapObservable(valueAccessor());
        var bindings = allBindings();
        var $table;
        var options = {};
        var completed = false;
        var $element = $(element);

        options.tabs = bindings.tabbedParent;
        options.myTab = bindings.myTab;

        if (typeof value === "string") {
            $table = $element.find(value);
            options.parent = $element;
        } else {
            $table = $(element);
            options.parent = bindings.parent;
        }

        if ($table == undefined) throw new Error("The table element can not be found. Selector: '" + value + "'.");
        
        if (bindings.rebuildTrigger) {
            if (!ko.isObservable(bindings.rebuildTrigger))
                throw new Error("Invalid binding: \"rebuildTrigger\". Must be observable object.");

            bindings.rebuildTrigger.subscribe(function () {
                stickyHeaders($element.find(value), options);
            }, null, 'rendered');
        }

        bindTable();
        
        function bindTable() {
            //Enables the jQuery transformation to be deferred until after the dependent object has data
            var dependsOn = bindings['dependsOn'];
            if (dependsOn && deferToDependency()) {
                return;
            }

            function deferToDependency() {
                var $dependency = typeof dependsOn === "string"
                    ? $element.children(':first')
                    : $(dependsOn);
                if (!$dependency) return false;

                var dependencyElement = $dependency[0];
                var dependencyContext = ko.contextFor(dependencyElement);
                var dependencyBindings = ko.bindingProvider.instance.getBindings(dependencyElement, dependencyContext);

                if (dependencyHasTemplate()) {
                    var fnName = '__stickyTableHeaders__updateHeaders__';
                    if (isVirtualElement()) {
                        dependsOn.data = attachAfterRenderBinding.call(dependsOn.data);
                        dependencyContext.$data[fnName] = function () {
                            var table = typeof (value) === "string" 
                                ? $(arguments[0]).filter(value) || $element.find(value)
                                : value;

                            if (!table.length) {
                                console.error("The table element could not be found. When attaching stickyTableHeaders within template, the value parameter should contain a selector for the table.");
                                return;
                            }

                            var context = ko.contextFor(dependsOn);
                            var theadDependency = bindings.stickyTableHeaderDependency;
                            if (typeof theadDependency === "string") theadDependency = context.$data[theadDependency];
                            options.parent = table;
                            if (ko.isObservable(theadDependency)) {
                                theadDependency.subscribe(function() {
                                    stickyHeaders(table, options);
                                });
                            } else {
                                stickyHeaders(table, options);
                            }
                        };
                    } else {
                        var binding = $dependency.attr('data-bind').each(attachAfterRenderBinding);
                        $dependency.attr('data-bind', binding);
                        dependencyContext.$data[fnName] = function () {
                            stickyHeaders($element.find(value), options);
                        };
                    }
                    return true;

                }

                return false;

                function isVirtualElement() {
                    return dependencyElement.nodeType === 8
                        && ko.virtualElements.virtualNodeBindingValue(dependsOn);
                }
                function dependencyHasTemplate() {
                    return dependencyBindings && dependencyBindings.template;
                }
                function attachAfterRenderBinding() {
                    return this.replace(/(template\:\s?\{)/, "$1" + 'afterRender:' + fnName + ',');
                }
            }
            
            stickyHeaders($table, options);
        }
        
        function stickyHeaders(table, opts) {
            table.each(function () {
                if (!this.tagName || this.tagName.toLowerCase() !== 'table') {
                    throw new Error("The bound element is not a table element. Element selector: '" + value + "'");
                }
            });
            table.stickyTableHeaders(opts);
            completed = true;
        }
    }
};

ko.bindingHandlers.stickyTableFooters = {
    init: function (element) {
        $(element).stickyTableFooters();
    },
    update: function (element) {
        $(element).stickyTableFooters();
    }
};

ko.bindingHandlers.tooltip = {
    init: function (element, bindingAccessor, allBindings) {
        var value = ko.utils.unwrapObservable(bindingAccessor()),
            bindings = allBindings && allBindings() || {};

        if (typeof value == "number") value = value.toString();
        if (!value || value.length == 0) return;

        var $element = $(element);
        $element.attr('title', value);
        $element.tooltip({
            track: bindings.tooltipTrack,
        });
        //todo: enable updates to the tooltip value
    },
};

ko.bindingHandlers.datePicker = {
    init: function (element, valueAccessor, allBindings) {
        $(element).wrap('<div class="input-group"></div>');
        $(element).datepicker({
            showOn: 'button',
            buttonText: '<i class="fa fa-calendar"></i>',
            changeMonth: true,
            changeYear: true
        }).next(".ui-datepicker-trigger")
            .addClass("btn btn-default")
            .wrap('<span class="input-group-btn"></span>');

        ko.utils.domNodeDisposal.addDisposeCallback(element, function () {
            //todo: cleanup wrapper element
            $(element).datepicker('destroy');
        });
    }
};;

ko.bindingHandlers.sortableTable = {
    init: function(element, onMoved) {
        $(element).sortable({
            placeholder: "ui-sortable-highlight",
            forcePlaceHolderSize: true,
            start: function(event, ui) {
                var colspan = ui.item.parents(1).find("th").length;
                ui.placeholder.html("<td colspan='" + colspan + "'></td>");
            },
            stop: onMoved(),
            helper: function(e, ui) {
                ui.children().each(function() {
                    $(this).width($(this).width());
                });
                return ui;
            }
        }).disableSelection();
    }
};


ko.bindingHandlers.autoHeightTextarea = {
    init: function(element, valueAccessor) {
    },
    update: function(element, valueAccessor) {
        element.style.height = '0';
        element.style.height = element.scrollHeight + 'px';
    }
};

// autocomplete: listOfCompletions
ko.bindingHandlers.autocomplete = {
    init: function (element, valueAccessor, allBindings) {
        var optionValues = ko.utils.arrayMap(ko.unwrap(valueAccessor()), function (c) {
            if (c.Name && !c.label) c.label = c.Name;
            return c;
        });
        var opts = ko.unwrap(allBindings().autocompleteOptions || {});
        opts = $.extend(opts, {
            source: optionValues,
            minLength: 0,
            change: function (e, ui) {
                var bindingContext = ko.contextFor(element);
                if (!bindingContext) return;
                var bindings = ko.bindingProvider.instance.getBindings(element, bindingContext) || {};
                if (!bindings.value) return;

                if (ui.item && ui.item.value) {
                    bindings.value(ui.item.value);
                }
                    // enable new elements to be added to the list
                else if (opts.allowNewValues) bindings.value($(this).val());
                else {
                    bindings.value(null);
                    if (ko.DEBUG) {
                        console.log('The selected value was not found in the options list. To allow new values, include the \"allowNewValues=\'true\'\" value in the \"autocompleteOptions\" binding attribute.');
                    }
                }
            }
        });
        $(element).autocomplete(opts);
    },
    update: function (element, valueAccessor) {
        var completions = ko.utils.arrayMap(ko.utils.unwrapObservable(valueAccessor()), function (c) {
            if (c.Name && !c.label) c.label = c.Name;
            return c;
        });
        $(element).autocomplete("option",{
            source: completions
        });
    }
};

ko.bindingHandlers.tabs = {
    init: function (element, valueAccessor, allBindings) {
        var $element = $(element);
        var value = ko.utils.unwrapObservable(valueAccessor());
        $(element).val(value);
        
        var options = ko.utils.unwrapObservable(allBindings().tabOptions) || {};
        
        $element.on("tabsactivate", onTabActivate);
        $element.on("tabscreate", onTabCreate);
        
        $element.tabs(options);

        ko.utils.domNodeDisposal.addDisposeCallback(element, function() {
            $element.tabs("destroy");
            $element.off('tabsactivate', onTabActivate);
            $element.off('tabscreate', onTabCreate);
        });


        function onTabActivate(event, ui) {
            bindValueFromUI(ui.newTab.text(), ui.newPanel[0]);
        }
        
        function onTabCreate(event, ui) {
            bindValueFromUI(ui.tab.text(), ui.panel[0]);
        }

        function bindValueFromUI(name, panel) {
            if (!ko.isObservable(valueAccessor())) return;
            valueAccessor()({
                name: name,
                data: getDataBoundObjectFor(panel)
            });
        }

        function getDataBoundObjectFor(tabPanel) {
            if (!tabPanel) return undefined;
            var panelContext = ko.contextFor(tabPanel);
            if (!panelContext) return undefined;
            var bindings = ko.bindingProvider.instance.getBindings(tabPanel, panelContext) || {};
            return bindings.with || panelContext.$data;
        }
    },
};

ko.bindingHandlers.ajaxStatus = {
    init: function(element, valueAccessor) {
        var value = valueAccessor();
        if (value.ajaxSuccess == undefined
            || value.ajaxFailure == undefined
            || value.ajaxWorking == undefined) throw new Error("The bound value is not valid for use with the ajaxStatus binding.");

        ko.applyBindingsToNode(element, {
            css: {
                working: value.ajaxWorking,
                success: value.ajaxSuccess,
                fail: value.ajaxFailure,
                ajaxStatus: true,
            }
        });
    }
};


// Dragons be here...
// allows up/down arrows, mouse-click dragging, 
// and mouse-click wheel
// accepts property 'negative'in allBindings to allow negative numbers
ko.bindingHandlers.numValue = {
    init: function (element, valueAccessor, allBindings) {
        console.warn("numValue binding handler is being used! This should be replaced with the numericObservable.");
        var num = valueAccessor();
        var bindings = ko.utils.unwrapObservable(allBindings());
        var isChar = function(key) { return key >= 65 && key <= 90; };
        var up = 38, down = 40;
        $(element).keydown(function(evt) {
            var key = evt.keyCode;
            var iVal = parseInt(element.value);
            if (key === up || key === down) {
                if (key === up) iVal++;
                else if (key == down && (bindings.negative || iVal > 0)) iVal--;
            }
            else if (isChar(key) && !evt.ctrlKey) evt.preventDefault();
            if (!isNaN(iVal) && iVal != null) num(iVal);
            else num(null);

            return true;
        });
        var isDown = false;
        var lastY = 0;
        var buffer = 10;
        $(element).mousedown(function (e) { isDown = true; return true; });
        $(document).mouseup(function (e) { isDown = false; return true; });
        $(document).mousemove(function (e) {
            if (isDown) {
                var y = e.pageY;
                if (!lastY) lastY = y;
                if (y > lastY + buffer && (bindings.negative || num() > 0)) {
                    num(num() - 1);
                    lastY = y;
                }
                else if (y + buffer < lastY) {
                    num(num() + 1);
                    lastY = y;
                }
            }
        });
        $(document).on("mousewheel", function (evt) {
            if (isDown) {
                var delta = evt.originalEvent.wheelDelta;
                if (delta > 0) {
                    num(num() + 1);
                }
                else if (delta < 0 && (bindings.negative || num() > 0)) {
                    num(num() - 1);
                }
            }
        });

        // show validations as well
        return ko.bindingHandlers['validationCore'].init(element, valueAccessor, allBindings);
    },
    update: function (element, valueAccessor, allBindings) {
        var val = ko.utils.unwrapObservable(valueAccessor());
        if (!isNaN(val)) element.value = val;
    }
};

ko.bindingHandlers.resizable = {
    init: function (element, valueAccessor) {
        var alsoResizeSelector = ko.unwrap(valueAccessor());
        if (typeof alsoResizeSelector != "string") alsoResizeSelector = '';
        $(element).resizable({
            alsoResize: alsoResizeSelector,
            minWidth: 300,
            minHeight: 100
        });
    }
};

ko.bindingHandlers.accordion = {
    init: function (element, valueAccessor) {
    },
    update: function (element, valueAccessor) {
        var opts = ko.utils.unwrapObservable(valueAccessor());
        $(element).accordion(opts);
    }
};

ko.bindingHandlers.slimscroll = {
    init: function (element) {
        var $el = $(element);
        $el.slimscroll({
            //alwaysVisible: true,
            railColor: '#222',
            height: "100%"
            //railVisible: true
        });
    }
};

//******************************
// EXTENDERS 

ko.extenders.timeEntry = function (target) {
    var pattern = /^(\d)?(\d)?:?(\d)?(\d)?$/;
    target.formattedTime = ko.computed({
        read: function () {
            if (!target()) return '00:00';
            var val = target();
            var formatted = val;
            switch (val.length) {
                case 1:
                    formatted = val.replace(pattern, "0$1");
                case 2:
                    formatted += ":00";
                    break;
                case 3:
                    formatted = val.replace(pattern, "0$1:$2$3");
                    break;
                case 4:
                    formatted = val.replace(pattern, "$1$2:$3$4");
                    break;
            }
            return formatted;
        },
        write: function (value) {
            if (typeof value === "string") {
                var parsed = Date.parse(value);
                if (parsed) {
                    var d = new Date(parsed);
                    var hours = d.getHours();
                    hours = hours < 10 ? ('0' + hours) : hours;
                    var minutes = d.getMinutes();
                    minutes = minutes < 10 ? ('0' + minutes) : minutes;
                    value = hours + ":" + minutes;
                }
            }
            target(value);
        }
    });

    target.extend({ pattern: { message: "Invalid Date", params: /^([01]\d|2[0-3]):?([0-5]\d)$/ } });
    target.Hours = ko.computed(function () {
        if (!target.formattedTime()) return 0;
        return target.formattedTime().split(":")[0];
    });
    target.Mins = ko.computed(function () {
        if (!target.formattedTime()) return 0;
        return target.formattedTime().split(":")[1];
    });
    target.formattedTime(target());
    return target;
};

ko.extenders.toteKey = function (target, callback) {
    var pattern = /^(0)?([1-9])(\s?)(\d{2})?(\s)?(\d{4})?$/;
    var isComplete = ko.observable(false);
    target.formattedTote = ko.computed({
        read: function () {
            var value = target();
            return formatTote(value);
        },
        write: function (input) {
            var value = cleanInput(input);
            if (target() === value) return;

            target(value);
            if (value && value.match(pattern)) {
                var formatted = formatTote(value);
                if (formatted.length === 10) {
                    isComplete(true);
                    if (typeof callback === "function") callback(formatted);
                }
            }
        },
    });
    target.isComplete = ko.computed(function () {
        return isComplete();
    });
    target.getNextTote = function () {
        var formatted = target.formattedTote();
        var sequence = parseSequence();
        if (isNaN(sequence)) return null;
        sequence++;

        var sequenceString = formatSequence();
        return formatted.replace(pattern, '0$2 $4 ' + sequenceString);

        function parseSequence() {
            var sections = formatted.split(" ");
            if (sections.length !== 3) return null;
            return parseInt(sections[2]);
        }
        function formatSequence() {
            var val = sequence.toString();
            while (val.length < 4) {
                val = "0" + val;
            }
            return val;
        }
    };
    target.isMatch = function (val) {
        var formattedVal = formatTote(ko.utils.unwrapObservable(val));
        if (!formattedVal) return false;
        var p = new RegExp("^" + target.formattedTote() + "$");
        return formattedVal.match(p);
    };

    target.extend({ throttle: 800 });
    target.formattedTote(target());
    return target;

    function formatTote(input) {
        if (input == undefined) return '';
        if (!input.match(pattern)) return input;
        input = input.trim();
        return input.replace(pattern, '0$2 $4 $6').trim().replace("  ", " ");
    }
    function cleanInput(input) {
        if (typeof input == "number") input = input.toString();
        if (typeof input !== "string") return undefined;
        return input.replace(/\s/g, '');
    }
};

ko.extenders.lotKey = function (target, matchCallback) {
    var pattern = /^(0)?([1-9])(\s?)(\d{2})?(\s)?(\d{3})?(\s?)(\d{2}\d*)?$/;
    var completePattern = /^(\d{2})(\s)(\d{2})(\s)(\d{3})(\s)(\d{2}\d*)$/;
    var isComplete = ko.observable(false);
    target.formattedLot = ko.computed({
        read: function () {
            return target();
            //var value = target();
            //if (!value) return '';
            //return value.match(pattern)
            //    ? formatAsLot(value)
            //    : value;
        },
        write: function (value) {
            value = cleanInput(value);
            if (target() === value) return;

            var formatted = formatAsLot(value);
            target(formatted);
            if (formatted && formatted.match(completePattern)) {
                isComplete(true);
                if (typeof matchCallback === "function") matchCallback(formatted);
            }

        }
    });

    function cleanInput(input) {
        if (typeof input == "number") input = input.toString();
        if (typeof input !== "string") return undefined;
        return input.trim();
    }
    function formatAsLot(input) {
        if (input == undefined) return undefined;
        input = input.trim();
        return input.replace(pattern, '0$2 $4 $6 $8').trim().replace("  ", " ");
    }

    target.match = function (valueToCompare) {
        var partialPattern = new RegExp('^' + target.formattedLot() + '$');
        return valueToCompare.match(partialPattern);
    };
    target.isComplete = ko.computed(function () {
        return isComplete();
    }, target);
    target.Date = ko.computed(function () {
        if (this.formattedLot()) {
            var sections = this.formattedLot().split(" ");
            var days = parseInt(sections[2]);
            var defDate = "1/1/" + (parseInt(sections[1]) >= 90 ? "19" : "20");
            var date = new Date(defDate + sections[1]).addDays(days - 1);
            date.addMinutes(date.getTimezoneOffset());

            return new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
        }
    }, target);
    target.formattedDate = ko.computed(function () {
        var date = this();
        if (date && date != 'Invalid Date') return date.format("UTC:m/d/yyyy");
        return '';
    }, target.Date);
    target.Sequence = ko.computed({
        read: function () {
            if (this.formattedLot()) {
                var sections = this.formattedLot().split(" ");
                if (sections.length === 4)
                    return sections[3];
            }
        },
        write: function (newSeq) {
            var val = '';
            if (isComplete()) {
                var reg = /^(0)?([1-9])(\s?)(\d{2})?(\s)?(\d{3})?(\s?)/;
                val = this.formattedLot().match(reg)[0];
                val += newSeq < 10 ? '0' : '';
                val += newSeq;
                this.formattedLot(val);
            }
        }
    }, target);
    target.getNextLot = function () {
        var sequence = parseInt(target.Sequence());
        sequence++;
        if (sequence < 10) sequence = '0' + sequence;
        return target.formattedLot().replace(pattern, '0$2 $4 $6 ' + sequence);
    };

    target.extend({ throttle: 800 });

    target.formattedLot(target());
    return target;
};

ko.extenders.contractType = function (target) {
    var options = {
        0: "Contract",
        1: "Quote",
        2: "Spot",
        3: "Interim"
    };
    return new TypeExtension(target, options, options[0]);
};

ko.extenders.contractStatus = function (target) {
    var options = {
        0: "Pending",
        1: "Rejected",
        2: "Confirmed",
        3: "Completed"
    };
    return new TypeExtension(target, options, options[0]);
};

ko.extenders.defectType = function (target) {
    return new TypeExtension(target, rvc.helpers.defectTypeOptions, rvc.helpers.defectTypeOptions[0]);
};

ko.extenders.lotHoldType = function (target) {
    return new TypeExtension(target, rvc.helpers.lotHoldTypeOptions, rvc.helpers.lotHoldTypeOptions[0]);
};

ko.extenders.defectResolutionType = function (target) {
    return new TypeExtension(target, rvc.helpers.defectResolutionOptions, rvc.helpers.defectResolutionOptions[0]);
};

ko.extenders.productionStatusType = function (target) {
    return new TypeExtension(target, rvc.helpers.productionStatusTypeOptions, rvc.helpers.productionStatusTypes[0]);
};

ko.extenders.lotQualityStatusType = function (target) {
    return new TypeExtension(target, rvc.helpers.lotQualityStatusTypeOptions, rvc.helpers.lotQualityStatusTypes[0]);
};

ko.extenders.inventoryType = function (target) {
    return new TypeExtension(target, rvc.helpers.inventoryTypeOptions, rvc.helpers.inventoryTypeOptions[0]);
};

ko.extenders.productType = function (target) {
    return new TypeExtension(target, rvc.helpers.lotTypeOptions, rvc.helpers.lotTypeOptions[0]);
};
ko.extenders.lotType = function (target) {
    return new TypeExtension(target, rvc.helpers.lotTypeOptions, rvc.helpers.lotTypeOptions[0]);
};

ko.extenders.chileType = function (target) {
    var options = {
        0: 'Other Raw',
        1: 'Dehydrated',
        2: 'WIP',
        3: 'Finished Goods'
    };
    return new TypeExtension(target, options, options[0]);
};

ko.extenders.treatmentType = function (target) {
    return new TypeExtension(target, rvc.helpers.treatmentTypeOptions, rvc.helpers.treatmentTypeOptions[0]);
};

ko.extenders.shipmentStatusType = function (target) {
    return new TypeExtension(target, rvc.helpers.shipmentStatusOptions, rvc.helpers.shipmentStatusOptions[0]);
};

ko.extenders.movementTypes = function (target) {
    var options = {
        0: 'Same Warehouse',
        1: 'Between Warehouses',
    };
    return new TypeExtension(target, options, options[0]);
};

ko.extenders.inventoryOrderTypes = function (target, defaultOption) {
    return new TypeExtension(target, rvc.helpers.inventoryOrderTypeOptions, defaultOption);
};

// Data input binding extension. Converts input to numeric values.
ko.extenders.numeric = function (target, precision) {
    console.warn('Replace numeric binding extender with numericObservable object');
    var mode = 'readonly', isWriteable = false;
    if (!ko.isWriteableObservable(target)) {
        mode = 'writeable';
        isWriteable = true;
        //throw new Error('Object must be a writableObservable in order to be used with the numeric binding. For read-only binding, use formatNumber instead.');
    }

    target.numericMode = mode;
    if (isWriteable) return writable();
    else return readonly();

    function writable() {
        applyFormatting(target());
        target.subscribe(applyFormatting, target);
        return target;

        function applyFormatting(value) {
            value = formatValue(value);
            if (value === target()) return;
            setValue(value);
        }
        function setValue(value) {
            target(value);
        }
    }

    function readonly() {
        target.formattedNumber = ko.computed({
            read: function () {
                return formatValue(target()) || undefined;
            },
            write: function (val) {
                target(formatValue(val) || undefined);
            }
        }, target);
        return target;
    }

    function formatValue(input) {
        var numVal = parseFloat(input);
        if (isNaN(numVal)) return undefined;
        else return parseFloat(numVal.toFixed(precision));
    }
};

//Read-only binding for displaying numeric values with a specific decimal precision.
//For numeric input bindings, use the numeric binding instead.
ko.extenders.formatNumber = function (target, precision) {
    function formatValue(input) {
        precision = parseInt(precision) || 0;
        return precision > 0 ? parseFloat(input).toFixed(precision) : parseInt(input);
    }

    target.formattedNumber = ko.computed(function () {
        return formatValue(target()) || 0;
    }, target);
    return target;
};

//******************************
// MAPPING HELPERS

ko.mappings = ko.mappings || {};
ko.mappings.formattedDate = function (options, format) {
    var dateString = options.data;
    var date = null;
    if (typeof dateString == "string" && dateString.length > 0) {
        if (dateString.match(/^\/Date\(\d*\)\/$/)) {
            dateString = dateString.replace(/[^0-9 +]/g, '');
            dateString = parseInt(dateString);
        }
        date = new Date(dateString).toISOString();
    }
    var result = ko.observable(date).extend({ isoDate: format || 'm/d/yyyy' });
    return result;
};


//****************************************
// validation rules
ko.validation.rules['isUnique'] = {
    validator: function (newVal, options) {
        if (options.predicate && typeof options.predicate !== "function")
            throw new Error("Invalid option for isUnique validator. The 'predicate' option must be a function.");

        var array = options.array || options;
        var count = 0;
        ko.utils.arrayMap(ko.utils.unwrapObservable(array), function (existingVal) {
            if (equalityDelegate()(existingVal, newVal)) count++;
        });
        return count < 2;

        function equalityDelegate() {
            return options.predicate ? options.predicate : function (v1, v2) { return v1 === v2; };
        }
    },
    message: 'This value is a duplicate',
};

/*
 * Determines if a field is required or not based on a function or value
 * Parameter: boolean function, or boolean value
 * Example
 *
 * viewModel = {
 *   var vm = this;     
 *   vm.isRequired = ko.observable(false);
 *   vm.requiredField = ko.observable().extend({ conditional_required: vm.isRequired});
 * }   
*/
ko.validation.rules['conditional_required'] = {
    validator: function (val, condition) {
        var required;
        if (typeof condition == 'function') {
            required = condition();
        } else {
            required = condition;
        }

        if (required) {
            return !(val == undefined || val.length == 0);
        } else {
            return true;
        }
    },
    message: "Field is required"
};

ko.validation.rules['doesNotEqual'] = {
    validator: function (v1, v2) {
        ko.validation.rules['doesNotEqual'].message = "\"" + v1 + "\" is not valid.";
        return v1 !== v2;
    },
};

ko.validation.rules['isValidTreatment'] = {
    validator: function (val) {
        return val !== rvc.helpers.treatmentTypes.NotTreated.key
            && val !== rvc.helpers.treatmentTypes.LowBac.key;
    },
    message: "Invalid Treatment"
};

ko.validation.rules['isTrue'] = {
    validator: function (value, fnInvalid) {
        return fnInvalid.apply(value) === true;
    },
    message: "The new location is the same as the previous location. There is no need to create a movement if the items don't change location.",
};

ko.validation.registerExtenders();


//******************************************
// private functions

function TypeExtension(target, options, defaultOption) {
    target.displayValue = ko.computed({
        read: function () {
            if (target() == undefined) return '';
            return getTypeOption(target()) || defaultOption;
        }
    });
    target.options = buildSelectListOptions(options);
    return target;

    function buildSelectListOptions(source) {
        var selectListOptions = [];
        for (var opt in source) {
            selectListOptions.push({
                key: opt,
                value: source[opt]
            });
        }
        return selectListOptions;
    }
    function getTypeOption(val) {
        switch (typeof val) {
            case "string": return fromString(val);
            case "number": return fromNumber(val);
            case "object": return fromObject(val);
            default: return undefined;
        }

        function fromString(s) {
            return fromNumber(parseInt(s))
                || findOptionByName();

            function findOptionByName() {
                for (var prop in options) {
                    if (options[prop] === s) {
                        return fromString(prop);
                    }
                }
                return undefined;
            }
        }
        function fromNumber(num) {
            if (isNaN(num)) return undefined;
            return options[num + ''];
        }
        function fromObject(o) {
            if (!o || o.value == undefined) return undefined;
            return o.value;
        }
    }
}