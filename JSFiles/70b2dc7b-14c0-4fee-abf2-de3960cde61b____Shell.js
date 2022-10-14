(function($, global, fxResources, undefined) {
    "use strict";

    // Section: Extension Support

    function compileTemplates() {
        /// <summary>Compiles extension templates</summary>
        Shell.Diagnostics.Telemetry.timerStart("cdm.compileTemplates");

        // Load the templates for all the extensions
        for (var i = 0, l = window.templates.length; i < l; i++) {
            var template = window.templates[i];
            var extension = Shell.extensionIndex[template.extensionName];

            if (!extension) {
                continue;
                // Don't warn now that some extensions might not be in the global extension collection if they're not activated.
                // TODO: (fx-activation) Keep the template data around for on demand extension activation?
                // TODO: (fx-activation) Differentiate between extensions that don't exist and extensions which haven't been activated
                //                Shell.Diagnostics.Log.writeEntry("cdm.CannotCompileTemplateError", "Cannot compile template '" + template.templateName + "' as extension '" + template.extensionName +
                //                    "' was not found. Check the extension name in the client extension js exactly matches the one in the UI Manifest, " +
                //                    "and that the client extension js contains no syntax error that may prevent it from loading.", Shell.Diagnostics.LogEntryLevel.error);
            } else {
                extension.templateUris[template.templateName] = template.src;
                try {
                    var localizedTemplateContent = DataLab.ApplyLocalizationToHTMLResource(template.content);
                    var compiledTemplate = $.templates(null, {
                        markup: localizedTemplateContent,
                        helpers: { extensionName: template.extensionName }
                    });
                    extension.templates[template.templateName] = compiledTemplate;
                } catch (err) {
                    var msg = Shell.Utilities.htmlEncode("Compilation error for template '" + template.src + "' referenced by extension '" + template.extensionName +
                         "' as '" + template.templateName + "'. The error message was: " + err.message || err.Message || err);
                    Shell.Diagnostics.Log.writeEntry("cdm.CompilationError", msg, Shell.Diagnostics.LogEntryLevel.error);
                    extension.templates[template.templateName] = $.templates("<div>" + msg + "</div>");
                }
            }
        }
        Shell.Diagnostics.Telemetry.timerStopAndLog("cdm.compileTemplates", "Compile extension templates (" + l + "):");
    }

    // Register template tags
    function registerTags() {
        // Register "res" and "link" tags which return localized resource string based on the key
        // Example usage inside a template: {{res "HelloWorld"/}}
        // with parameters: {{res "HelloUser" username="Admin" /}}
        //      where HelloUser = "Hello, {username}!"
        // with TikiWiki markup and helper functions: {{res "FeatureIsNotAvailable" url=~getBetaSignUpUrl() id="betaSignup"}}
        //      where FeatureIsNotAvailable = "Feature is not available, please sign up for [{id}|preview program|{url}]"
        // note that helper functions need to be registered before they can be used in a template, this is not done as part of cdm.js

        // ENCODING
        //  The default encoding is HTML.
        //  Other encodings can be specified by setting the _encode tag property: 
        //      Example: <span data-fxcontrol-linktext="{{res 'diagMKHelpBalloonLinkText' _encode='attr'/}}"></span>
        //  Allowed values for _encode:
        //      'attr' - HTML attribute encoding - encodes <, & ' and "
        //      'url' - URL encoding, using encodeURI(string)
        //      'html' - HTML encoding - which is also the default value, when the _encode property is not specified
        //      'none' - No encoding. Switches off the default HTML encoding
        //      Note that only the default HTML encoding is compatible with tikiwiki markup in resource strings 
        //          which is used to add safe HTML markup within string resource inserted into HTML content

        function getResourceValue(resourceKey, getResourcesFunc) {
            var helpers = this.view.tmpl.helpers,
                extension = helpers ? Shell.extensionIndex[helpers.extensionName] : null,
                resources = extension && getResourcesFunc(extension),
                encode = this.props._encode || "html",
                encoder, resourceString;

            // return the key if none of the resource bundles has the resource
            resourceString = resources && resources[resourceKey] || resourceKey;

            // process any parameters that were passed in
            resourceString = resourceString.format(this.props);

            if (encode !== "none") {
                encoder = encode === "html" ? Shell.Utilities.SafeMarkup.create : $.views.converters[encode];
                if (!encoder) {
                    throw 'Unknown resource encoder: "' + encode + '"';
                }
                resourceString = encoder(resourceString);
            }
            return resourceString;
        }

        $.views.tags("res", function(resourceKey) {
            return getResourceValue.call(
                this,
                resourceKey,
                function(extension) {
                    return extension.getResources ? extension.getResources() : null
                });
        });

        $.views.tags("link", function(resourceKey) {
            return getResourceValue.call(
                this,
                resourceKey,
                function(extension) {
                    return extension.getLinks ? extension.getLinks() : null
                });
        });

        $.views.tags("url", function(value) {
            return fxResources.getContentUrl(value);
        });
    }

    // Section: Collection View Support

    // Collection view
    var collectionView;

    function collectionViewClickHandler(extension, dataSet, rowIndex) {
        /// <summary>Handles the select of items in the collection view. Internal function intended to be removed
        /// when collection view is replaced by a control.</summary>
        /// <param name="extension" type="String">The extension driving the collection view</param>
        /// <param name="dataSet" type="Object">The data set</param>
        var validRowIndex = typeof (rowIndex) === "number";
        var data = dataSet[dataSet.collectionPropertyName || "data"];
        var rowData = validRowIndex ? data[rowIndex] : {};

        // Set the active row
        cdm.setActiveItem(rowData);

    }

    // Section: CDM Core Object
    window.cdm = {
        // Current partner context
        currentContext: {},
        // Currently selected item
        currentActiveItem: null,
        // Currently selected extension
        currentExtension: null,
        // Unqiue ID for the session
        sessionId: null,
        // Currently active wizard if there is one
        currentWizard: null,
        // Flag that indicates if a non-wizard dialog is being shown
        dialogActive: false,

        // State Management and tracking Support API

        setActiveItem: function(activeItem) {
            /// <summary>Sets the active item. Listeners are called when the active item changes and when properties on the active item change.</summary>
            /// <param name="activeItem">The active item</param>
            $(cdm.currentActiveItem).unbind("propertyChange.aux-activeItem");

            $.observable(cdm).setProperty("currentActiveItem", activeItem);
            $(cdm.currentActiveItem).bind("propertyChange.aux-activeItem", function(event, data) {
                $(cdm).trigger("activeItemChanged", { activeItem: cdm.currentActiveItem, changeType: "Property", originalEventData: data });
            });
            $(cdm).trigger("activeItemChanged", { activeItem: cdm.currentActiveItem, changeType: "Replaced", originalEventData: null });
        },

        getActiveItem: function() {
            /// <summary>Gets the active item previously set by setActiveItem</summary>
            /// <remarks>ActiveItem must only be accessed through the getter and setter as allowing direct assignment results in memory leaks and broken bindings</remarks>
            /// <returns type="Object">The active item</returns>
            return cdm.currentActiveItem;
        },

        extensionShowCategory: function(show, extensionName) {
            var theExtension = null;
            if (extensionName in Shell.extensionIndex) {
                theExtension = Shell.extensionIndex[extensionName];
                $.observable(theExtension.navItem).setProperty("isVisible", show);
            }
        },

        showPreviewLabel: function(element, extension) {
            // Make sure we do not add the preview label more than once
            var show = ("isBeta" in extension) && extension.isBeta;
            if (show) {
                var resources = (Resources && Resources.getResources) ? Resources.getResources("fx") : null;
                var previewLabel = resources && resources.fxshell_previewbadge_previewButtonText ? resources.fxshell_previewbadge_previewButtonText : "Preview";  // Fall back to English if not defined
                element.find(".preview-badge-ontitle").remove();
                element.append("<span class='preview-badge-ontitle'>" + previewLabel + "</span>");
            }
        },

        // Collection View API
        updateCollectionView: function(extension, dataSet, title) {
            var tabContainer = $("#tabcontainer"),
                t = tabContainer.tabs();

            t.refresh();

            tabContainer.hide();

            $("#aux-pane-grid").show();

            $("#aux-GridHeader").text(title || "Items");

            this.showPreviewLabel($(".itemtitle"), extension);

            if (!dataSet) {
                dataSet = {};
            }
            var data = dataSet[dataSet.collectionPropertyName || "data"] || [];

            // Get the currently displayed container properties
            var auxContainer = $("#aux-pane-grid");

            // Clone the container and make sure it is showing the "refreshing" message
            // and it doesn't have elements.
            var clonedGrid = auxContainer.clone();
            clonedGrid.find("div.aux-gridview").remove();
            var oldGridInstance = auxContainer.find("div.aux-gridview"); ////.data("grid");
            ////if (oldGridInstance) {
            ////    oldGridInstance.dispose();
            ////}

            if (oldGridInstance) {
                cdm._disposeElement(oldGridInstance);
            }

            auxContainer.after(clonedGrid);
            auxContainer.remove();

            // Repopulate the cloned item before you insert it on the screen
            var containerElement = clonedGrid.find("#aux-collectionView");

            // Clone the columns collection references so that column updates don't write back to the extension
            var columns = [];

            var gridView = extension && extension.gridView;

            if (gridView && gridView.columns) {
                columns = $.map(gridView.columns, function(column) { return $.extend(true, {}, column); });
            }

            containerElement
                .wazDataGrid({
                    columns: columns,
                    data: data,
                    selectFirstRowByDefault: true,
                    selectable: true,
                    rowSelect: function(evt, args) {
                        // TODO support multi-select
                        collectionViewClickHandler(extension, dataSet, args.selected && $.inArray(args.selected.dataItem, data));
                    }
                });

            if (gridView && typeof gridView.activated === "function") {
                gridView.activated(extension, containerElement, data);
            }

            // Save a reference to the grid so we can interact with it later
            collectionView = containerElement;

            // TODO: handle no data better in the control.
            // Eg: controlHtml = "<span>No collection view has been defined for extension '<b>" + Shell.Utilities.htmlEncode(extension.name) + "</b>'</span>";
            // TODO: handle changes to column size and save them.
        },

        selectCollectionViewRow: function(propertyNameOrIndex, propertyValue) {
            /// <summary>Selects the first row in the grid with the name property having the named value, or selects a row by index</summary>
            /// <param name="propertyNameOfIndex" type="Object">The name of the property to match, or the numeric index of the line</param>
            /// <param name="propertyValue" type="String" optional="true">The value to match against the property</param>
            if (!collectionView) {
                return;
            }
            var dataItem, data = collectionView.wazDataGrid("option", "data");
            if (typeof (propertyNameOrIndex) === "number") {
                dataItem = data[propertyNameOrIndex];
            } else {
                for (var i = 0, l = data.length; i < l; i++) {
                    if (data[i][propertyNameOrIndex] === propertyValue) {
                        dataItem = data[i];
                        break;
                    }
                }
            }
            if (dataItem) {
                var rowMetadata = collectionView.wazDataGrid("option", "rowMetadata"),
                    oldSelectedRowMetadata = collectionView.wazDataGrid("getSelectedRows"),
                    newSelectedRowMetadata = $.grep(rowMetadata, function(metadata) {
                        return metadata.dataItem === dataItem;
                    })[0];

                // Clear the old selection
                // TODO support multi-select
                $.each(oldSelectedRowMetadata, function() {
                    $.observable(this).setProperty("selected", false);
                });

                // Set the new selection
                if (!newSelectedRowMetadata) {
                    // Create new row metadata if dataItem has not yet been rendered in the grid.
                    newSelectedRowMetadata = { dataItem: dataItem };
                    $.observable(rowMetadata).insert(rowMetadata.length, newSelectedRowMetadata);
                }
                $.observable(newSelectedRowMetadata).setProperty("selected", true);

                // Indirectly call setActiveItem
                collectionView.wazDataGrid("option", "rowSelect")(null, { selected: newSelectedRowMetadata });  // TODO: Ugh!  Refactor to call proper cdm method.
            }
        },

        // Tabs API
        updateTabsView: function(extension, navFilter, dataSet, tabsData) {
            var itemTitle, auxContainer;

            if (!dataSet) {
                dataSet = {};
            }

            if (extension) {
                // Hide containers which are not necessary
                $("#aux-pane-grid").hide();

                // Ensure that the pivot container is actually visible
                auxContainer = $("#tabcontainer");
                auxContainer.show();

                // Set the title on the tabcontainer

                itemTitle = auxContainer.find(".itemtitle");
                itemTitle.text(tabsData.title);

                this.showPreviewLabel(itemTitle, extension);

                // Set the pivot as selected
                Impl.UI.Pivots.selectPivot(extension.id, tabsData.selected, navFilter, dataSet);
            }
        },

        renderGridView: function(settings) {
            var root = settings.root,
                data = settings.data,
                dataSource = settings.dataSource,
            // Clone the columns collection references so that column updates don't write back to the extension
                columns = $.map(settings.columns, function(column) { return $.extend(true, {}, column); }),
                rowMetadata = settings.rowMetadata,
                container = settings.gridContainer || $(root).find("div.gridContainer"),
                id = typeof settings.id === "undefined" ? "id" : settings.id,
                dataLoad = settings.dataLoad,
                statusHelpBalloonHandle;

            // Re: "destroy", there are scenarios where there will be no grid to destroy here.
            // We're following the AUX-predominant pattern here.  Might break in future jQuery UI versions.

            container
                .wazDataGrid("destroy")
                .wazDataGrid({
                    id: id,
                    columns: columns,
                    data: data,
                    dataSource: dataSource,
                    rowMetadata: rowMetadata,
                    selectFirstRowByDefault: true,
                    selectable: true,
                    rowSelect: function(evt, args) {
                        // TODO support multi-select
                        cdm.setActiveItem(args.selected && args.selected.dataItem || null);
                    },
                    dataLoad: dataLoad
                });

            if (settings.enableStatusHelp) {
                container
                    .on("mouseenter", "tbody .status", function() {
                        var dataItem = $(this).closest("tr").view().data.rowMetadata.dataItem,
                            statusIcon = $(this).find(".waz-grid-status");

                        if (dataItem && typeof dataItem.StateHelpText === "string") {
                            statusHelpBalloonHandle = global.Shell.UI.Balloon.create("help", {
                                content: Shell.Utilities.htmlEncode(dataItem.StateHelpText),
                                position: "top"
                            });

                            if (statusHelpBalloonHandle) {
                                global.Shell.UI.Balloon.show(statusHelpBalloonHandle, global.Shell.UI.Balloon.getBoundaries(statusIcon));
                            }
                        }
                    })
                    .on("mouseleave", ".status", function() {
                        if (statusHelpBalloonHandle) {
                            global.Shell.UI.Balloon.hide(statusHelpBalloonHandle);
                            global.Shell.UI.Balloon.destroy(statusHelpBalloonHandle);
                        }
                    });
            }
            return container;
        },

        // UI Helpers
        _disposeElement: function(e) {
            e.find("[data-hasdispose]").add(e).each(function() {
                if (this.dispose) {
                    this.dispose();
                }
            });
        },

        _renderTemplate: function(jqElement, template, primaryData, context) {
            /// <summary>Renders a template into the specified element using the specified template. Internal method used by controls.</summary>
            /// <param name="jqElement" type="jQuery">jQuery element to which the template will be rendered</param>
            /// <param name="template" type="String">The template to use.</param>
            /// <param name="primaryData" type="Object">Data for populating the template that can be access directly by property name</param>
            /// <param name="context" type="Object">Optional. Context for the template</param>
            cdm._disposeElement(jqElement.children());
            try {
                template.link(jqElement, primaryData, context);
            }
            catch (err) {
                var msg = Shell.Utilities.htmlEncodeVariable(err.message || err.Message || err);
                Shell.Diagnostics.Log.writeEntry("cdm.ErrorRenderingTemplate", msg, Shell.Diagnostics.LogEntryLevel.error);

                // TODO: Determine if this needs to be removed from shipping code
                jqElement.append("<h2>Error</h2><p>" + msg + "</p>"); // Append, rather than replace html, since the latter may itself trigger linking errors
            }
        },

        _initialize: function() {
            // Templates have been loaded via <script> tag. Compile them
            compileTemplates();
            registerTags();
            Shell.UI.Navigation.initializeNav();
        }
    };
})(jQuery, this);

(function($, global, undefined) {
    "use strict";

    var transformValue = function(value) {
        var valueUpperCase = (value || "").toUpperCase();
        if (valueUpperCase === "TRUE") {
            return true;
        } else if (valueUpperCase === "FALSE") {
            return false;
        } else if (/^-?\d*\.?\d*?$/.test(value)) {
            return +value;
        } else {
            return value;
        }
    },

    dashAlpha = /-([a-z]|[0-9])/ig,

    camelCaseReplace = function(all, letter) {
        return (letter + "").toUpperCase();
    },

    camelCaseTransform = function(string) {
        return string.replace(dashAlpha, camelCaseReplace);
    },

    htmlEncode = function (text) {
        if (text === undefined || text === null) {
            return "";
        }
        // this has a jQuery dependency
        var helperDiv = $('<div />');
        return helperDiv.text(text).html();
    },

    attributesToObject = function(element, attributeBase, camelCase, unmodified) {
        /// <summary>
        /// Reads the attributes starting with the attributeBase and creates an object
        /// key value pair using the camelCase dash separator.
        /// Boolean and Number values are transformed automatically.
        ///
        /// Example:
        /// Using the following attribute: data-base-abc-def="value"
        /// With the attributeBase: data-base
        /// The output will be
        /// { abcDef: "value" }
        /// Note: You provide more than one element, only the first one is returned.
        /// </summary>
        /// <param name="element" domElement="true">DOM Element.</param>
        /// <param name="attributeBase" type="String">The base attribute.</param>
        /// <param name="camelCase" type="Boolean" optional="true">Provides the camelCase value of the key. True by default</param>
        /// <param name="unmodified" type="Boolean" optional="true">Provides the unmodified version of the key. False by default</param>
        /// <returns type="Object" />

        var result = {},
            test = new RegExp("^" + attributeBase.replace("-", "\\-") + "\\-(.+)$"),
            attributes = element.attributes || [], i, len,
            match, value;

        for (i = 0, len = attributes.length; i < len; i++) {
            match = attributes[i].nodeName.match(test);
            if (match) {
                value = transformValue(attributes[i].nodeValue);
                if (camelCase === undefined || camelCase) {
                    result[camelCaseTransform(match[1])] = value;
                }
                if (unmodified) {
                    result[match[1]] = value;
                }
            }
        }

        return result;
    },

    // We start at 2000, we need to be above everything already.
    zIndex = 2000,
    getNextZIndex = function(current) {
        /// <summary>
        /// Returns the next counter for using the zIndex.
        /// Starts at 2000.
        /// </summary>
        /// <param name="current" type="Number" optional="true">Provide the current zindex you have to verify if it needs to be incremented.</param>
        /// <returns type="Number" />

        // jQuery UI takes zIndex and zIndex+1 and +2... we need to bump by 3.
        // This will go away soon. Only bugfix.
        return parseInt(current, 10) === zIndex ? current : (zIndex += 3);
    },

    getUrlWithQueryStringParameter = function(url, key, value) {
        /// <summary>
        /// Gets a URL with a key/value pair. It will replace the current key if found in the url.
        /// </summary>
        /// <param name="url" type="String">The URL.</param>
        /// <param name="key" type="String">The key.</param>
        /// <param name="value" type="String">The value.</param>
        /// <returns type="String" />

        url = url || "";

        var regEx = new RegExp("([?&])" + key + "=.*?(&|$)", "i"),
            hashPosition = url.indexOf("#"),
            urlWithoutHash = hashPosition >= 0 ? url.substr(0, hashPosition) : url,
            hash = hashPosition >= 0 ? url.substr(hashPosition) : "",
            separator;

        // If the url is missing a slash after the domain name, we add it
        if (urlWithoutHash.split("/").length === 3) {
            urlWithoutHash += "/";
        }

        key = encodeURIComponent(key);
        value = encodeURIComponent(value);

        if (urlWithoutHash) {
            separator = urlWithoutHash.indexOf("?") !== -1 ? "&" : "?";

            if (urlWithoutHash.match(regEx)) {
                urlWithoutHash = urlWithoutHash.replace(regEx, "$1" + key + "=" + value + "$2");
            } else {
                urlWithoutHash = urlWithoutHash + separator + key + "=" + value;
            }

            return urlWithoutHash + hash;
        }

        return null;
    },

    forceRead = function(element, addAriaLive) {
        /// <summary>Adds and removes an element to force the narrator to read the section again.</summary>
        /// <param name="element" type="Object" domElement="true">DOM element.</param>
        /// <param name="addAriaLive" type="Boolean" optional="true">Adds aria-live to polite then restores the previous value.</param>

        var tagName = element.tagName,
            newElementTagName, newElement,
            previousAriaLive;
        switch (tagName) {
            case "TABLE":
                // Add one row
                newElementTagName = "tr";
                break;
            case "TR":
                // Add one cell
                newElementTagName = "td";
                break;
            case "UL":
                // Add one list-item
                newElementTagName = "li";
                break;
            default:
                // Add an inline element
                newElementTagName = "span";
        }

        if (addAriaLive) {
            previousAriaLive = element.getAttribute("aria-live");
            element.setAttribute("aria-live", "assertive");
        }

        newElement = global.document.createElement(newElementTagName);
        element.appendChild(newElement);
        element.removeChild(newElement);

        if (addAriaLive) {
            if (previousAriaLive) {
                element.setAttribute("aria-live", previousAriaLive);
            } else {
                element.removeAttribute("aria-live");
            }
        }
    };

    $.extend(true, global, {
        fx: {
            utilities: {
                attributesToObject: attributesToObject,
                getNextZIndex: getNextZIndex,
                getUrlWithQueryStringParameter: getUrlWithQueryStringParameter,
                htmlEncode: htmlEncode,
                forceRead: forceRead
            }
        }
    });
})(jQuery, this);

(function($, base, global, fxUtilities, undefined) {
    "use strict";

    var uuid = 0,
        balloonMeasurerLeft = -99999,
        balloonMeasurerTop = -99999,
        balloonMeasurerWidth = 2000,
        balloonMeasurerHeight = 2000,
        prefixId = "__fx-balloon",
        hiddenClass = "fx-balloon-hidden",
        templateString = "<div class='fx-balloon-pointer'></div><div class='fx-balloon-content'>{{:html}}</div>",
        template = $.templates(templateString),
        existingOpenBalloons = [],
        delayedHideBalloon = {
            _documentClickHandler: null,
            _targetBalloon: null, // timeout handler target
            _targetClicked: false, // disable last document.onClick event for balloon
            _timeoutHandler: null,
            _delayLength: 1000, // balloon hide delay in ms
            _targetActive: false, // turn on/off delay on the given balloon
            _locked: false,

            setLocked: function() {
                delayedHideBalloon._locked = true;
            },

            setUnlocked: function() {
                delayedHideBalloon._locked = false;
            },

            _hideBalloon: function(target) {
                if (!delayedHideBalloon._locked) {
                    if (delayedHideBalloon._targetBalloon &&
                        delayedHideBalloon._targetBalloon !== target) {
                        delayedHideBalloon._targetBalloon.hide();
                        delayedHideBalloon._targetBalloon = null;
                        delayedHideBalloon._targetClicked = false;
                        delayedHideBalloon._targetActive = false;
                    }
                }
            },

            _cancelHandler: function() {
                if (!delayedHideBalloon._locked) {
                    if (delayedHideBalloon._timeoutHandler) {
                        global.clearTimeout(delayedHideBalloon._timeoutHandler);
                    }
                    delayedHideBalloon._timeoutHandler = null;
                }
            },

            reset: function() {
                /// <summary>Resets the whole structure to clean state.</summary>

                delayedHideBalloon._locked = false;
                delayedHideBalloon._targetBalloon = null;
                delayedHideBalloon._targetClicked = false;
                delayedHideBalloon._cancelHandler();
                delayedHideBalloon._targetActive = false;
            },

            setActive: function() {
                /// <summary>Deactivates hover hide timeout.</summary>

                if (!delayedHideBalloon._locked) {
                    delayedHideBalloon._targetActive = true;
                }
            },

            setInactive: function() {
                /// <summary>Deactivates the balloon and allows it to hide when hovered.</summary>

                if (!delayedHideBalloon._locked) {
                    delayedHideBalloon._targetActive = false;
                }
            },

            cancelHideTimeout: function() {
                /// <summary>Cancel currently visible balloon hide timeout.</summary>

                if (!delayedHideBalloon._locked) {
                    delayedHideBalloon._cancelHandler();
                }
            },

            targetClicked: function(target) {
                /// <summary>Hides currently visible balloon if the handle doesn't match, otherwise doesn't let the
                /// document.onClick to close the balloon. We want this whenever any field associated w/balloon
                /// has been clicked (e.g. textbox).</summary>

                if (!delayedHideBalloon._locked) {
                    delayedHideBalloon.hideVisibleImmediately(target);
                    delayedHideBalloon._targetClicked = true;
                }
            },

            hideVisibleImmediately: function(target) {
                /// <summary>Hides currently visible balloon, unless the handle matches.</summary>

                if (!delayedHideBalloon._locked) {
                    delayedHideBalloon._cancelHandler();
                    delayedHideBalloon._hideBalloon(target);
                }
            },

            setupHideTarget: function(target) {
                /// <summary>Sets up the balloon as current delay balloon.
                /// Hides any other visisble delay balloon.</summary>

                if (!delayedHideBalloon._locked) {
                    if (delayedHideBalloon._targetBalloon &&
                        delayedHideBalloon._targetBalloon !== target) {
                        delayedHideBalloon.hideVisibleImmediately();
                    }

                    delayedHideBalloon._targetBalloon = target;
                }
            },

            setupHideTimeout: function(target) {
                /// <summary>Closes other delay balloons if visible, then set balloon's hide timeout.</summary>

                if (!delayedHideBalloon._locked) {
                    // we allow only one balloon at a time
                    if (delayedHideBalloon._targetBalloon &&
                        delayedHideBalloon._targetBalloon !== target) {
                        delayedHideBalloon.hideVisibleImmediately();
                    } else {
                        delayedHideBalloon.cancelHideTimeout();
                    }

                    delayedHideBalloon._targetBalloon = target;
                    delayedHideBalloon._timeoutHandler = global.setTimeout(function() {
                        delayedHideBalloon._hideBalloon();
                        delayedHideBalloon._timeoutHandler = null;
                    }, delayedHideBalloon._delayLength);
                }
            }
        };

    /// <summary>
    /// Creates a balloon with a pointer to enhance the understanding of the UI.
    /// You can create this widget on an element with content or you can use the option html.
    /// </summary>
    $.widget("fx.fxBalloon", {
        options: {
            /// <option type="String">
            /// Holds the data in the balloon.
            /// You can leave it empty if you want to use the content of the element.
            /// </option>
            html: "",

            /// <option type="String">
            /// Specifies the position where the balloon has to show around an element.
            /// Valid positions are:
            ///   * top
            ///   * right
            ///   * bottom
            ///   * left
            /// </option>
            position: "right",

            /// <option type="String">
            /// jQuery selector where the balloon will be added to the DOM.
            /// You can use a string or a jQuery element.
            /// </option>
            appendTo: "body",

            /// <option type="Number">
            /// Hides the balloon after an amount of milliseconds.
            /// To not hide it automatically, set it to 0.
            /// </option>
            hideAfter: 0,

            /// <option type="Boolean">
            /// Hides all the other balloons that have been previously opened.
            /// </option>
            closeOtherBalloons: false,

            /// <option type="Boolean">
            /// Hides the ballooon either after hideAfter or the default delayedHideBalloon._delayLength
            /// </option>
            delayHide: null,

            /// <option type="Boolean">
            /// Triggers the delayed hide just after showing balloon
            /// </option>
            triggerHide: null
        },

        _originalParent: null,
        _balloonMeasurer: null,
        _previousBox: null,
        _id: null,

        _mouseUpHandler: null,
        _mouseEnterHandler: null,
        _mouseLeaveHandler: null,

        
        _create: function() {
            if (!this.options.html) {
                this.options.html = this.element.html();
            }

            if (!/^(top|right|bottom|left)$/.test(this.options.position)) {
                throw "Balloon position has to be either: top, right, bottom, or left";
            }

            if (this.options.hideAfter) {
                this.options.delayHide = true;

                this.options.hideAfter = parseInt(this.options.hideAfter, 10);
                if (isNaN(this.options.hideAfter)) {
                    throw "Balloon hideAfter must be a number if specified";
                }

                delayedHideBalloon._delayLength = this.options.hideAfter;
            }

            if (this.options.triggerHide) {
                this.options.delayHide = true;
            }

            if (typeof this.options.horizontalOffset === "number") {
                this.options.horizontalOffset = { preferred: this.options.horizontalOffset, alternate: this.options.horizontalOffset };
            }

            if (typeof this.options.verticalOffset === "number") {
                this.options.verticalOffset = { preferred: this.options.verticalOffset, alternate: this.options.verticalOffset };
            }

            if (this.options.appendTo) {
                this._originalParent = this.element.parent();
                this.element.appendTo(this.options.appendTo);
            }

            this._balloonMeasurer = $("<div/>")
                .css({
                    position: "absolute",
                    left: balloonMeasurerLeft,
                    top: balloonMeasurerTop,
                    width: balloonMeasurerWidth,
                    height: balloonMeasurerHeight
                });

            this.element
                .attr({
                    "aria-hidden": "true",
                    "aria-live": "assertive",
                    "aria-atomic": "true",
                    role: "alert",
                    id: this.getElementId()
                })
                .addClass("fx-balloon")
                .css("z-index", fxUtilities.getNextZIndex())
                .html(template.render(this.options));

            base._create.call(this);
        },

        _destroy: function() {
            /// <summary>Destroys the widget.</summary>

            this.element
                .removeAttr("role aria-hidden aria-live aria-atomic")
                .removeClass("fx-balloon")
                .removeClass(hiddenClass)
                .html(this.options.html);

            this._removePointerClass();

            // If we move the balloon, then let's put it back
            if (this._originalParent) {
                this.element.appendTo(this._originalParent);
                this._originalParent = null;
            }

            this._cleanupDelayEvents();

            this._super();
        },

        _documentClick: function(evt) {
            var clickTarget = $(evt.target).closest(".fx-balloon");

            if (delayedHideBalloon._targetClicked) {
                delayedHideBalloon._targetClicked = false;
            } else if (clickTarget.length === 0) {
                delayedHideBalloon.hideVisibleImmediately();
            }
        },

        setActive: function() {
            /// <summary>Deactivates hover hide timeout.</summary>

            delayedHideBalloon.setActive(this);
        },

        setInactive: function() {
            /// <summary>Deactivates the balloon and allows it to hide when hovered.</summary>

            delayedHideBalloon.setInactive();
        },

        hideVisibleImmediately: function() {
            /// <summary>Hides currently visible balloon, unless the handle matches.</summary>

            delayedHideBalloon.hideVisibleImmediately(this);
        },

        cancelDelayHide: function() {
            /// <summary>Cancel currently visible balloon hide timeout.</summary>

            delayedHideBalloon.cancelHideTimeout();
        },

        setupTarget: function() {
            /// <summary>Sets up the balloon as current delay balloon.
            /// Hides any other visisble delay balloon.</summary>

            delayedHideBalloon.setupHideTarget(this);
        },

        targetClicked: function() {
            /// <summary>Hides currently visible balloon if the handle doesn't match, otherwise doesn't let the
            /// document.onClick to close the balloon. We want this whenever any field associated w/balloon
            /// has been clicked (e.g. textbox).</summary>

            delayedHideBalloon.targetClicked(this);
        },

        setupDelay: function() {
            /// <summary>Closes other delay balloons if visible, then set balloon's hide timeout.</summary>

            delayedHideBalloon.setupHideTimeout(this);
        },

        setLocked: function() {
            delayedHideBalloon.setLocked();
        },

        setUnlocked: function() {
            delayedHideBalloon.setUnlocked();
        },

        show: function(box) {
            /// <summary>
            /// Shows the balloon around a box boundaries.
            /// To get the correct boundaries, you can call Shell.UI.Balloon.getBoundaries().
            /// </summary>
            /// <param name="box" type="Object">
            /// A box boundaries including the following keys:
            ///   * left
            ///   * top
            ///   * width
            ///   * height
            ///
            /// The coordinates must be in relation with the appendTo variable passed in the options.
            /// </param>

            var balloon,
                location = {},
                balloonBoxPreferred,
                balloonBoxAlternate,
                outerElement,
                preferredPosition,
                alternatePosition,
                sidePositionKey,
                otherSidePositionKey,
                sizeKey,
                otherSizeKey,
                type = "preferred",
                balloonBoxFinal,
                maxWidth,
                lastMaxWidth,
                that = this;

            if (this.options.delayHide && delayedHideBalloon._locked) {
                return;
            }

            box = box || this._previousBox;
            this._previousBox = box;

            this._cleanupDelayEvents();

            if (this.options.closeOtherBalloons) {
                while (existingOpenBalloons.length > 0) {
                    balloon = existingOpenBalloons.splice(0, 1)[0];
                    // Don't hide ourselves
                    if (balloon !== this) {
                        balloon.hide();
                    }
                }
            }

            // We received a box with position/size
            this._removePointerClass();
            if (box) {
                do {
                    outerElement = this.element.offsetParent();
                    preferredPosition = this.options.position;
                    alternatePosition = this._getAlternatePosition(preferredPosition);
                    sidePositionKey = this._getSidePositionKey(preferredPosition);
                    otherSidePositionKey = this._getOtherSidePositionKey(preferredPosition);
                    sizeKey = this._getSizeKey(preferredPosition);
                    otherSizeKey = this._getOtherSizeKey(preferredPosition);

                    if (outerElement[0].tagName === "BODY") {
                        outerElement = $(global);
                    }

                    // The balloonBoxPreferred and alternate dictates the MAIN position
                    // If we have left or right, the main position taken is left
                    // If we have top or bottom, the main position taken is top
                    // Then we have the preferred OTHER position that is dictated by the object preferred/alternate
                    // If we position left or right, the OTHER position taken is top
                    // If we position top or bottom, the OTHER position taken is left
                    balloonBoxPreferred = this._getBalloonBox(box, preferredPosition, maxWidth); // maxWidth is explicitly undefined first time through loop
                    balloonBoxAlternate = this._getBalloonBox(box, alternatePosition, maxWidth);

                    balloonBoxFinal = balloonBoxPreferred;

                    switch (preferredPosition) {
                        case "right":
                        case "bottom":
                            if (box[sidePositionKey] + box[sizeKey] + balloonBoxPreferred.preferred[sidePositionKey] + balloonBoxPreferred[sizeKey] > outerElement[sizeKey]()) {
                                balloonBoxFinal = balloonBoxAlternate;
                            }
                            break;
                        case "left":
                        case "top":
                            if (box[sidePositionKey] + balloonBoxPreferred.preferred[sidePositionKey] < 0) {
                                balloonBoxFinal = balloonBoxAlternate;
                            }
                            break;
                    }

                    if ((box[otherSidePositionKey] + balloonBoxFinal.preferred[otherSidePositionKey] + balloonBoxFinal[otherSizeKey] > outerElement[otherSizeKey]()) && (box[otherSidePositionKey] + balloonBoxFinal.alternate[otherSidePositionKey] > 0)) {
                        type = "alternate";
                    }

                    location = {
                        left: box.left + balloonBoxFinal[type].left,
                        top: box.top + balloonBoxFinal[type].top
                    };

                    // To finish, the left and top can never go under 0
                    location.top = Math.max(0, location.top);
                    location.left = Math.max(0, location.left);

                    // Add the pointer
                    if (balloonBoxFinal === balloonBoxPreferred) {
                        this.element.addClass("fx-balloon-box-" + preferredPosition);
                    } else {
                        this.element.addClass("fx-balloon-box-" + alternatePosition);
                    }

                    if (type === "preferred") {
                        this.element.addClass("fx-balloon-box-position-preferred");
                    } else {
                        this.element.addClass("fx-balloon-box-position-alternate");
                    }

                    this.element
                        .css(location);

                    // lastMaxWidth is used to prevent an infinite loop. Haven't seen one occur in practice
                    // but safe guarding against it seems prudent.
                    lastMaxWidth = maxWidth;

                    // BUG 445397 - If the balloon runs in to the right side of the screen then it will
                    // wrap and our off screen measurement will be inaccurate. We can detect that by checking if
                    // the reported width of the element matches our offscreen measurement. If not we'll take
                    // the actual width and use that to recalcuate the size of the final box for positioning next loop
                    maxWidth = parseInt(this.element.css("width"), 10);
                } while (maxWidth !== lastMaxWidth && maxWidth !== balloonBoxFinal.width);
            }

            if (this.options.delayHide) {
                this.element.on("mouseup", this._mouseUpHandler = function() {
                    // 'click' is not triggered, thus mouseup is used here
                    delayedHideBalloon.cancelHideTimeout();
                })
                .on("mouseenter", this._mouseEnterHandler = function() {
                    delayedHideBalloon.cancelHideTimeout();
                })
                .on("mouseleave", this._mouseLeaveHandler = function() {
                    if (!delayedHideBalloon._targetActive) {
                        delayedHideBalloon.setupHideTimeout(that);
                    }
                });

                if (!delayedHideBalloon._documentClickHandler) {
                    $("html").on("click", delayedHideBalloon._documentClickHandler = function() {
                        return that._documentClick.apply(that, arguments);
                    });
                }
            }

            // add to the global open balloon list
            existingOpenBalloons.splice(0, 0, this);

            this.element
                .attr("aria-hidden", "false")
                .removeClass(hiddenClass);

            if (this.options.triggerHide) {
                // Trigger timeout immediately
                delayedHideBalloon._targetClicked = true;
                this._mouseLeaveHandler();
            }

            fxUtilities.forceRead(this.element[0]);
        },

        hide: function(forceHide) {
            /// <summary>
            /// Hides the balloon from the screen.
            /// </summary>
            /// <param name="forceHide">
            /// Force hide even active balloons.
            /// </param>

            if (forceHide) {
                delayedHideBalloon.reset();
            }

            if (this.element === delayedHideBalloon._targetActive) {
                return;
            }

            this._cleanupDelayEvents();
            this.element
                .attr("aria-hidden", "true")
                .addClass(hiddenClass);
        },

        getElementId: function() {
            /// <summary>
            /// Gets the element ID. If the id didn't exist beforehand, an ID is automatically created.
            /// </summary>
            /// <returns type="String" />

            return this.element[0].id || this._id || (this._id = prefixId + (uuid++));
        },

        _cleanupDelayEvents: function() {
            if (this._mouseUpHandler) {
                this.element.off("mouseup", this._mouseUpHandler);
                this._mouseUpHandler = null;
            }

            if (this._mouseEnterHandler) {
                this.element.off("mouseenter", this._mouseEnterHandler);
                this._mouseEnterHandler = null;
            }

            if (this._mouseLeaveHandler) {
                this.element.off("mouseleave", this._mouseLeaveHandler);
                this._mouseLeaveHandler = null;
            }

            if (delayedHideBalloon._documentClickHandler) {
                $("html").off("click", delayedHideBalloon._documentClickHandler);
                delayedHideBalloon._documentClickHandler = null;
            }
        },

        _getAlternatePosition: function(position) {
            switch (position) {
                case "top":
                    return "bottom";
                case "right":
                    return "left";
                case "bottom":
                    return "top";
                case "left":
                    return "right";
            }
        },

        _getSidePositionKey: function(position) {
            switch (position) {
                case "top":
                case "bottom":
                    return "top";
                case "left":
                case "right":
                    return "left";
            }
        },

        _getOtherSidePositionKey: function(position) {
            switch (position) {
                case "top":
                case "bottom":
                    return "left";
                case "left":
                case "right":
                    return "top";
            }
        },

        _getSizeKey: function(position) {
            switch (position) {
                case "left":
                case "right":
                    return "width";
                case "top":
                case "bottom":
                    return "height";
            }
        },

        _getOtherSizeKey: function(position) {
            switch (position) {
                case "left":
                case "right":
                    return "height";
                case "top":
                case "bottom":
                    return "width";
            }
        },

        _removePointerClass: function() {
            this.element.removeClass("fx-balloon-box-top fx-balloon-box-right fx-balloon-box-bottom fx-balloon-box-left fx-balloon-box-position-preferred fx-balloon-box-position-alternate");
        },

        _readCssAndSetBaseline: function(balloon, box, position) {
            var location = {
                left: parseInt(this.element.css("left"), 10),
                top: parseInt(this.element.css("top"), 10),
                alignment: this.element.css("vertical-align")
            }, otherSidePositionKey = this._getOtherSidePositionKey(position), otherSizeKey = this._getOtherSizeKey(position);

            // Set the baseline
            switch (position) {
                case "right":
                    location.left += box.width;
                    break;
                case "left":
                    location.left -= balloon.width;
                    break;
                case "top":
                    location.top -= balloon.height;
                    break;
                case "bottom":
                    location.top += box.height;
                    break;
            }

            // Set the alignment from keyword
            switch (location.alignment) {
                case "bottom":
                    location[otherSidePositionKey] -= balloon[otherSizeKey] - box[otherSizeKey];
                    break;
                case "super":
                    location[otherSidePositionKey] -= balloon[otherSizeKey];
                    break;
                case "baseline":
                    location[otherSidePositionKey] += box[otherSizeKey];
                    break;
                case "middle":
                    location[otherSidePositionKey] -= (balloon[otherSizeKey] - box[otherSizeKey]) / 2;
                    break;
            }

            return location;
        },

        _getBalloonBox: function(box, position, maxWidth) {
            var currentParent = this.element.parent(),
                className = "fx-balloon-box-" + position,
                balloon,
                preferred, alternate;

            this._balloonMeasurer.appendTo(global.document.body);

            maxWidth = maxWidth || "";

            this.element
                .css({
                    left: "",
                    top: "",
                    bottom: "",
                    right: "",
                    width: maxWidth
                })
                .addClass(className);

            this.element.appendTo(this._balloonMeasurer);

            balloon = {
                width: this.element.width(),
                height: this.element.height()
            };

            this.element
                .removeClass("fx-balloon-position-alternate")
                .addClass("fx-balloon-position-preferred");
            preferred = this._readCssAndSetBaseline(balloon, box, position);
            this.element
                .removeClass("fx-balloon-position-preferred")
                .addClass("fx-balloon-position-alternate");
            alternate = this._readCssAndSetBaseline(balloon, box, position);
            this.element
                .removeClass("fx-balloon-position-alternate");

            $.extend(balloon, {
                preferred: preferred,
                alternate: alternate
            });

            // We should find a way to put it back EXACTLY where we took it off
            this.element
                .removeClass(className)
                .appendTo(currentParent);

            this._balloonMeasurer.detach();

            return balloon;
        },

        _setOption: function(key, value) {
            switch (key) {
                case "html":
                    this.element.find(".fx-balloon-content").html(value);
                    break;
                case "position":
                    if (this.element.attr("aria-hidden") === "false") {
                        this.options.position = value;
                        this.show(this._previousBox);
                    }
                    break;
            }

            return base._setOption.apply(this, arguments);
        }
    });
})(jQuery, jQuery.Widget.prototype, this, this.fx.utilities);