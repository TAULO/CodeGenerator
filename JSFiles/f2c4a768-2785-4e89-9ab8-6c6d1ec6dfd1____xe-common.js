/*******************************************************************************
 Copyright 2018 Ellucian Company L.P. and its affiliates.
 ******************************************************************************/

/* global _  */
/* global ToolsMenu */
/* global notifications */
/* global extensibilityInfo */
/* global log */

// xe namespace is for providing eXtensible Environment functionality.
// this will likely be provided as a service and injected
var xe = (function (xe) {
    'use strict';
    //Attributes
    xe.typePrefix = 'xe-';                                                       //prefix for xe specific html attributes
    xe.type = {field: 'field',section: 'section'};                               //logical type names
    xe.attr = {field: xe.typePrefix+'field', section: xe.typePrefix+'section', labelledBy: 'aria-labelledby', describedBy: 'aria-describedby'};   //html attribute names
    xe.replaceAttr = ['placeholder', 'title', 'label', 'buttonText', 'tabLabel', 'html', 'component', 'href'];
    xe.attrInh = {section: xe.typePrefix+'section-inh'};                         //html attribute name for section inherited
    xe.forAttribute = 'xe-for';
    xe.errors = [];
    xe.extensionsFound = false;
    xe.extensionsParseErrorId = "extensionsParseError";

    // TODO :grails_332_change, needs to revisit
    //$.fn.editable.defaults.placeholder = '';

    xe.log = function () {
        if (window.console && console.log && log.isDebugEnabled()) {
            var args = Array.prototype.slice.call(arguments, 0); // convert arguments to an array
            console.log((new Date()).toISOString(), args);
        }
    };

    //I18N - we use extensibility specific resource loading. We should investigate if we can
    //extend the baseline properties loading as done for ZK pages
    xe.loadResources = function(){
        if (typeof extensibilityInfo.resources !== 'undefined' ) {
            xe.log('Resources initialized');
            _.extend( $.i18n.map, extensibilityInfo.resources ); //data used for extending page
        }
    };

    // item is a string or an object with a key attribute
    xe.i18n = function (item, args) {
        return (typeof item === 'string')?item: $.i18n.prop(item.key, args);
    };

    //Check if we are in developer mode
    xe.devMode = function() {
        return !!window.extensibilityInfo.admin;
    };

    //Allow to disable extensions when we have developer privileges
    xe.enableExtensions = function() {
        return window.location.search.indexOf("baseline=y") === -1 || !xe.devMode();
    };


    // create a selector for an element - specify a name or a selector for all with a specific type
    xe.selector = function( elementType, name ) {
        if (name) {
            return '[' + xe.typePrefix + 'field' + '="' +name + '"]';
        }
        return '[' + xe.typePrefix + elementType + ']';
    };

    xe.selectorFor = function( name ) {
        return '[' + xe.forAttribute + (name ? '="' + name + '"':'=""') + ']';
    };

    // Create a selector for removing an element and its associated labels, etc.
    xe.selectorToRemove = function( elementType, name ) {
        return xe.selector( elementType, name) + ', ' + xe.selectorFor( name ); //['+xe.typePrefix+'="' + name + '"]';
    };

    xe.getFields = function(section) {
        var fields = $(xe.selector(xe.type.field),section);
        var res = [];
        $.each(fields, function(i,field ){
            res.push({name:field.attributes[xe.typePrefix+xe.type.field].value, html:field.outerHTML});
        });
        return res;
    };

    xe.getPageName  = function() {
        return extensibilityInfo.page;
    };

    xe.getApplication = function() {
        return extensibilityInfo.application;
    };

    // Metadata definition for page parsing - for now just for showing as a help for extension developers
    // Basic structure (example, Sections can be nested but don't have to):
    // Page
    //      Section1
    //          Section 1.1
    //              Field 1.1.1
    //              ...
    //          Section 1.2
    //          ...

    xe.Page = function(description) {
        return {
            description: description,
            application: xe.getApplication(),
            name: xe.getPageName()
        };
    };

    //metadata for baseline page
    xe.page = new xe.Page('Baseline Page');


    /*******************************************************************************************************
     Element positioning information relies on the correct order of repositioning due to dependencies
     This routine reorders positioning meta data accordingly
     *******************************************************************************************************/
    xe.reorderMetadata = function( extensions ) {

        function getDependency ( extension, extensions ){
            var complete = false;
            var dependency;
            var x = 0;

            function findUnprocessedNextSibling(extensions, extension) {
                return _.find(extensions,  function(n) {
                    return (n.name === extension.nextSibling) && n.processed === false;
                });
            }

            while ( !complete ) {
                x++;
                if ( x > 10000 ) {
                    xe.log("Circular dependency detected in metadata");
                    break;
                }
                dependency = findUnprocessedNextSibling(extensions, extension);

                if (!dependency) {
                    complete = true;
                } else {
                    extension = dependency;
                }
            }
            return extension;
        }

        function findUnProcessedExtension(extensions) {
            return  _.find( extensions, function(n){ return n.processed === false; });
        }
        var orderedMoves = [];
        var allExtensionsApplied = false;
        var extension;
        // mark all item positioning extensions as currently unprocessed
        _.each( extensions, function(n) {
            n.processed = false;
        });

        while ( !allExtensionsApplied ) {
            extension = findUnProcessedExtension(extensions);

            if ( extension ) {

                extension = getDependency( extension, extensions );
                orderedMoves.push( extension );

                // reorder fields if this is a section
                if ( extension.fields ) {
                    extension.orderedFields = xe.reorderMetadata( extension.fields );
                }

                extension.processed = true;

            } else {
                allExtensionsApplied = true;
            }
        }
        return orderedMoves;
    };


    /*******************************************************************************************************
     Apply extensions to all sections within rootElement
     Note that rootElement may itself be a section
     *******************************************************************************************************/
    xe.extend = function ( $rootElement ) {
        if (xe.extensionsFound) {
            if ( $($rootElement)[0] && $($rootElement)[0].hasAttribute( "xe-dynamic" ) ) {
                extendDynamicContent();
            } else {
                extendStaticContent();
            }
        }

        // return; //this return is not needed and is causing a JSHint warning

        /*******************************************************************************************************
         Replace the label text on a tab
         *******************************************************************************************************/
        function replaceTabLabel( extensions ) {
            $(xe.selectorFor(extensions.name)).find("a").html(xe.i18n(extensions.tabLabel));
        }


        /*******************************************************************************************************
         Determine any associated elements of the given element
         *******************************************************************************************************/
        function findAriaLinkedElements(ariaType, elementList) {
            var linkedElements = $();
            elementList.each(function() {
                var ariaLabels = $(this).attr(ariaType);
                if (ariaLabels) {
                    $.merge(linkedElements,$('#' + ariaLabels.split(' ').join(',#')));
                }
            });
            return linkedElements;
        }


        /*******************************************************************************************************
         Remove a section or field from the page
         *******************************************************************************************************/
        function removeElement( type, element ) {
            var elementsToRemove = $(element).add( $(xe.selectorFor(element.attributes[xe.typePrefix + type].value) ) );
            xe.log('Remove', type, element.attributes[xe.typePrefix + type].value,elementsToRemove);
            // include elements linked to this by aria-labelledby and aria-describedby ids
            $.merge(elementsToRemove,findAriaLinkedElements(xe.attr.labelledBy,elementsToRemove));
            $.merge(elementsToRemove,findAriaLinkedElements(xe.attr.describedBy,elementsToRemove));

            elementsToRemove.addClass('xe-exclude');
        }

        function showElement( type, element ) {
            var elementsToShow = $(element).add( $(xe.selectorFor(element.attributes[xe.typePrefix + type].value) ) );
            xe.log('Show', type, element.attributes[xe.typePrefix + type].value,elementsToShow);
            // include elements linked to this by aria-labelledby and aria-describedby ids
            $.merge(elementsToShow,findAriaLinkedElements(xe.attr.labelledBy,elementsToShow));
            $.merge(elementsToShow,findAriaLinkedElements(xe.attr.describedBy,elementsToShow));

            elementsToShow.removeClass('xe-exclude');
        }



        /*******************************************************************************************************
         Reposition a section or field
         *******************************************************************************************************/
        function moveElement( elementType, extension, parent ) {
            var to;
            var elementToMove = $(extension.element).addClass("xe-moved");
            var lastElement;
            var selector;

            xe.log('Move '+elementType +' '+ extension.name);
            if ( extension.nextSibling ) {
                to = $(xe.selector(elementType, extension.nextSibling),parent);
                if (to.length === 0) {
                    xe.errors.push('Unable to find target element. Type: ' + elementType + ' Name: ' + extension.nextSibling);
                } else {
                    elementToMove.insertBefore(to);
                }
            } else {
                // nextSibling specified as null so is positioned after it's last sibling of elementType if one exists
                selector = "[" + xe.typePrefix + elementType + "]";
                lastElement = elementToMove.siblings(selector).last();
                if ( lastElement.length > 0 ) {
                    elementToMove.insertAfter( lastElement );
                } else {
                    elementToMove.parent().append(elementToMove);
                }
            }
        }


        /*******************************************************************************************************
         Ensures siblings (sections or fields) are correctly ordered on the page as specified by any
         extensions.

         This routine:
         - determines an elements siblings which are of the same type as the element itself (section or field)
         - retrieves ordered extensibility information for element type
         - reorders the siblings according to this metadata
         *******************************************************************************************************/
        function orderSiblings( elementType, element, orderedExtensions ) {

            var siblings = $(element).add( $(element).siblings(xe.selector(elementType)) );
            _.each( orderedExtensions, function(extension) {

                var sibling = siblings.filter( xe.selector(elementType, extension.name) );
                if ( sibling.length > 0 && _.has(extension, "nextSibling") ) {
                    extension.element = sibling;
                    moveElement(elementType, extension, $(element).parent());
                }
            });
        }


        /*******************************************************************************************************
         Replace an attribute on a field
         *******************************************************************************************************/
        function replaceAttribute(fieldElement,attributeName,attributeValue) {
            $(fieldElement).attr(attributeName,xe.i18n(attributeValue));
        }


        /*******************************************************************************************************
         Replace the HTML of a field
         *******************************************************************************************************/
        function replaceHTML( fieldElement, fieldExtension ) {

            var newHTML = fieldExtension.attributes.html;

            $(fieldElement).html(newHTML);
            $(fieldElement).addClass("xe-replaced");
        }

        /*******************************************************************************************************
         Replace Component
         *******************************************************************************************************/
        function replaceComponent( fieldElement, fieldExtension ) {

            var newHTML = xe.renderComponent(fieldExtension.attributes.component);

            $(fieldElement).html(newHTML);
            $(fieldElement).addClass("xe-replaced");
        }


        /*******************************************************************************************************
         Replace the label text on a button item
         *******************************************************************************************************/
        function replaceButtonText( fieldElement, fieldExtension ) {

            if ( $(fieldElement).is("input") ) {
                $(fieldElement).attr("value",xe.i18n(fieldExtension.attributes.buttonText));
            } else if ( $(fieldElement).is("button") ) {
                $(fieldElement).html(xe.i18n(fieldExtension.attributes.buttonText));
            }
        }


        /*******************************************************************************************************
         Replace any labels associated with a field
         *******************************************************************************************************/
        function replaceLabel( fieldElement, fieldExtension ) {

            var labelElement;
            var itemId = fieldElement.attributes.id ? fieldElement.attributes.id.value : '';

            if ( fieldElement.attributes[xe.attr.labelledBy] ) {
                labelElement = $('#' + fieldElement.attributes[xe.attr.labelledBy].value);
            } else {
                //get label inside item
                labelElement = $('label', fieldElement);
                if (!labelElement.length) {
                    // check if parent element is a label
                    labelElement = $(fieldElement).parent().is('label') ? $(fieldElement).parent() : $();
                }
                if (!labelElement.length && itemId)  {
                    // check for label element marked as for this item id
                    labelElement = $("label[for='" + itemId + "']");
                }
            }
            if (labelElement.length) {
                // replace the text in the first text node of the label
                var labelTextNode = labelElement.contents().filter(function() { return this.nodeType === 3;})[0];
                if ( labelTextNode ) {
                    labelTextNode.nodeValue = xe.i18n(fieldExtension.attributes.label);
                }else if( $(labelElement)[0].hasAttribute( "ng-bind" )){
                    $(labelElement).removeAttr("ng-bind");
                    $(labelElement).html(xe.i18n(fieldExtension.attributes.label));
                }
            } else {
                xe.errors.push('Unable to find and replace label for '+ fieldExtension.name);
            }
        }

        /*******************************************************************************************************
         Extend field attributes
         *******************************************************************************************************/
        function extendFieldAttributes( fieldElement, fieldExtension ) {

            // determine if attributes are to be modified for xe-field or xe-data
            var element;
            var dataElement = $("[xe-data]", fieldElement);
            if (dataElement.length > 0) {
                element = dataElement[0];
            } else {
                element = fieldElement;
            }

            // Replace any attributes where new value provided
            _.each(xe.replaceAttr,function(attributeName) {

                if ( fieldExtension.attributes[attributeName] ) {

                    switch(attributeName) {
                        case "html":
                            replaceHTML(element, fieldExtension);
                            break;
                        case "component":
                            replaceComponent(fieldElement, fieldExtension); // fieldElement regardless of existence of xe-data for now
                            break;
                        case "label":
                            replaceLabel(fieldElement, fieldExtension);
                            break;
                        case "buttonText":
                            replaceButtonText(element, fieldExtension);
                            break;
                        default:
                            replaceAttribute(element,attributeName,fieldExtension.attributes[attributeName]);
                    }
                }
            });
        }


        /*******************************************************************************************************
         Apply any extensions to each section field in turn
         *******************************************************************************************************/
        function extendSectionFields(section, extensions) {
            var sectionFields = $(xe.selector(xe.type.field), section); //moved from _.each body - no need to search many times
            _.each(extensions.fields, function (fieldExtension) {
                var fieldElement = $(xe.selector(xe.type.field, fieldExtension.name), section)[0];
                if (!fieldElement) {
                    //Must be a new field, add a placeholder
                    var anchor = null;
                    if (fieldExtension.nextSibling) {
                        anchor = $(xe.selector(xe.type.field, fieldExtension.nextSibling), section)[0];
                    } else  { // not specified or null - take last field
                        anchor = sectionFields.length ? sectionFields[sectionFields.length - 1] : sectionFields[0];
                    }
                    if (anchor) {
                        var placeholder = $('<div xe-field="' + fieldExtension.name + '"></div>')[0];
                        fieldElement = anchor.parentNode.insertBefore(placeholder, null);
                    }
                }

                if ( fieldElement ) {

                    // exclude field
                    if ( fieldExtension.exclude ) {
                        removeElement(xe.type.field, fieldElement );
                        return;
                    }

                    //show field
                    if ( typeof fieldExtension.exclude !=  'undefined' && fieldExtension.exclude===false) {
                        showElement(xe.type.field, fieldElement);
                    }

                    // reposition field
                    if ( _.has(fieldExtension, "nextSibling") &&
                        !$(fieldElement).hasClass("xe-moved")
                        ) {
                        orderSiblings( xe.type.field, fieldElement, extensions.orderedFields );
                    }

                    // extend field attributes
                    if ( fieldExtension.attributes ) {
                        extendFieldAttributes( fieldElement, fieldExtension);
                    }
                } else {
                    xe.errors.push('Unable to find element ' + fieldExtension.name);
                }
            });
        }


        /*******************************************************************************************************
         Retrieve the metadata for a section and apply the extensions
         *******************************************************************************************************/
        function extendSection(section, sections) {
            var sectionName = section.attributes[xe.attr.section].value;

            // retrieve section metadata
            var extensions = _.find(xe.extensions.sections, function (sectionExtension) {
                return sectionName === sectionExtension.name;
            });

            xe.log("Extending section", section);

            if ( extensions ) {

                // exclude section
                if ( extensions.exclude ) {
                    removeElement( xe.type.section, section );
                    return;
                }

                // reposition section
                if ( _.has(extensions, "nextSibling") &&
                    !sections.filter(xe.selector(xe.type.section, sectionName )).hasClass( "xe-moved" )) {
                    orderSiblings(xe.type.section, section, xe.extensions.orderedSections);
                }

                // modify tab label
                if ( _.has(extensions, "tabLabel") ) {
                    replaceTabLabel(extensions);
                }

                // apply any defined extensions to the fields of this section
                extendSectionFields( section, extensions );

                $(section).addClass("xe-extended");
            }
        }


        function extendSections( extendRootElement ) {
            var sections = $( xe.selector( xe.type.section ), $rootElement );
            if ( extendRootElement ) {
                sections = sections.add( $rootElement[0] );
            }
            _.each( sections, function( section ) {
                extendSection( section, sections );
            });
        }


        /**
         * dynamic content always has xe-dynamic attribute
         * this attribute is always on container for dynamically loaded content
         *
         * is xe-section
         *   therefore no content outside this section that needs higher section information
         *   just extend this section - which extends contained sections
         * OR
         * is not xe-section
         *
         *   is contained in xe-section (inherited section)
         *     extend contained sections
         *     extend standalone xe-fields
         *   OR
         *   is not contained in xe-section
         *     extend contained sections
         *     standalone xe-fields illegal
         */
        function extendDynamicContent() {
            var inheritedSectionName,
                extensions;

            xe.log("Extending dynamic content: ", $rootElement);

            if ( $($rootElement[0]).is( xe.selector( xe.type.section ) ) ) {
                xe.log("Dynamic content is a section");

                extendSections( true );  // extend rootElement

            } else {
                xe.log("Dynamic content is not a section");

                inheritedSectionName = $rootElement.closest( ('[' + xe.attr.section + ']') )
                    .attr( xe.attr.section );
                if ( inheritedSectionName ) {
                    xe.log("Dynamic content is within a section");

                    extendSections( false );  // do not extend rootElement

                    // extend any xe-fields that have a containing xe-section outside this dynamic content
                    extensions = _.find( xe.extensions.sections, function( sectionExtension ) {
                        return inheritedSectionName === sectionExtension.name;
                    });
                    if ( extensions ) {
                        extendSectionFields( $rootElement, extensions );
                    }
                } else {
                    xe.log("Dynamic content is not within a section");

                    extendSections( false );  // do not extend rootElement
                }
            }
        }


        function extendStaticContent() {
            xe.log("Extending static content: ", $rootElement);

            if ( $($rootElement[0]).is( xe.selector( xe.type.section ) ) ) {
                extendSections( true );  // extend rootElement
            } else {
                extendSections( false ); // do not extend rootElement
            }
        }
    };  // end xe.extend


    //HTML rendering support
    xe.isVoidElement = function(tag) {
        //xe.voidElements is a map to specify the html element types that are 'void' (have no content)
        if (!xe.voidElements) {
            xe.voidElements = {};
            //Initialize voidElements map
            ["area", "base", "br", "col", "command", "embed", "hr", "img", "input",
                "keygen", "link", "meta", "param", "source", "track", "wbr"].forEach(function (val) {
                    xe.voidElements[val] = true;
                }
            );
        }
        return xe.voidElements[tag.toLowerCase()];
    };

    //Render a generic component as HTML (a component is a simplified representation of HTML DOM element)
    xe.renderComponent = function ( component ) {
        //Note: void elements don't need </tag> and have no content
        var result="";
        if (component.tagName) {
            result="<"+component.tagName;
            if (component.attributes) {
                Object.getOwnPropertyNames(component.attributes).forEach(function (val) {
                        result += ' ' + val + '="' + component.attributes[val] + '"';
                    }
                );
            }
            result += ">";
            //recursively add the child nodes
            if (component.childNodes && !xe.isVoidElement(component.tagName) ) {
                component.childNodes.forEach(function (val) {
                        result += ' ' + xe.renderComponent(val);
                    }
                );
            }
        }
        if (component.textContent && (!component.tagName || !xe.isVoidElement(component.tagName))) {
            result += component.textContent;
        }
        if (component.tagName && !xe.isVoidElement(component.tagName)){
            result += "</" + component.tagName + ">";
        }
        return result;
    };

    xe.popups = [null,null,null];

    xe.showStats = function (page, popup) {
        xe.renderStats = function(page){
            var res = $.i18n.prop("xe.page.status", [page.name]);
            if (xe.errors && xe.errors.length) {
                res += '<br>' + $.i18n.prop("xe.page.errors") + '<br>' + xe.errors;
            }
            return res;
        };

        if (!popup) {
            popup = $('<div id="pageStats.' + page.name + '" ></div>');
            popup.dialog({appendTo: "#content", width: 600, height: "auto"});
            popup.append(xe.renderStats(page));
        }
        popup.dialog("open");
        return popup;
    };

    xe.removeExtensionsParseError = function() {
        var parseNotificationError =  notifications.get(xe.extensionsParseErrorId);
        if (parseNotificationError) {
            notifications.remove(parseNotificationError);
        }
    };

    xe.extensionsChanged = function(popup) {
        var inputValue = $('#extensions-edit-input',popup).val();
        if ((!_.isEmpty(inputValue) && xe.page.metadata === undefined) ||
            (inputValue !== JSON.stringify(xe.page.metadata,null,2) && xe.page.metadata !== undefined)) {
            return true;
        }
        return false;
    };

    xe.extensionsEditor = function(page,popup) {
        if (!popup) {
            popup = $('<div id="extensionsEditor.' + page.name + '" ></div>');
            popup.dialog({
                dialogClass: "xe-extensions-editor",
                title: $.i18n.prop("xe.extension.editor.window.title"),
                appendTo: "#content", width: 600, height: "auto",
                buttons: [
                    {'class': 'secondary', text: $.i18n.prop("xe.btn.label.cancel"),
                      click: function() {
                          var dialogWindow = this;
                          if (xe.extensionsChanged(popup)) {
                              var n = new Notification({
                                  message: $.i18n.prop("xe.js.notification.editextensions.close.warningMessage"),
                                  type: "warning"
                              });

                              n.addPromptAction($.i18n.prop("xe.js.notification.editextensions.close.cancel"), function () {
                                  notifications.remove(n);
                              });

                              n.addPromptAction($.i18n.prop("xe.js.notification.editextensions.close.ok"), function () {
                                  notifications.remove(n);
                                  $(dialogWindow).dialog( "close" );
                                  xe.removeExtensionsParseError();
                              });

                              notifications.addNotification(n);
                          }
                          else {
                              $(dialogWindow).dialog( "close" );
                          }
                     }
                    },
                    {'class': 'primary', text: $.i18n.prop("xe.btn.label.submit"),
                     click: function(){
                        var dialogWindow = this;
                        if (xe.setExtensions($('#extensions-edit-input',popup).val())) {
                            xe.saveExtensions().done(function(){
                                $(dialogWindow).dialog( "close" );
                            });
                        }
                    }}
                ]
            });

            popup.load(extensibilityInfo.url+'assets/html/templates/extedit.html',
                function(){
                    $('#extensions-edit-input',popup).val(JSON.stringify(xe.page.metadata,null,2));
                }
            );
        }
        else {
            $('#extensions-edit-input',popup).val(JSON.stringify(xe.page.metadata,null,2));
        }
        popup.dialog("open");
        return popup;
    };

    //Post updated extensions to the database
    xe.saveExtensions=function(){
        //var md = JSON.parse(xe.page.metadata);
        var data={application: xe.page.application, page:xe.page.name, metadata: xe.page.metadata } ;
        return $.ajax({
            url: extensibilityInfo.url + 'webadmin/extensions',
            type:'POST',
            dataType: 'json',
            contentType: 'application/json; charset=utf-8',
            data: JSON.stringify(data),
            processData: true,
            success: function(data){
                notifications.addNotification( new Notification({
                    message: $.i18n.prop("xe.alert.msg.saved"),
                    type: "success",
                    flash: true
                }));
                xe.log('Data Saved',data);
            },
            error: function (request, status, error) {
                var errorMessage = JSON.parse(request.responseText).errors[0].errorMessage||error;
                notifications.addNotification( new Notification({
                    message: errorMessage,
                    type: "error",
                    flash: false
                }));
            }
        });
    };

    //Update the model with modifed extensions
    xe.setExtensions = function (value) {
        xe.removeExtensionsParseError();
        try {
            xe.page.metadata = JSON.parse(value);
            return true;
        } catch(e) {
            notifications.addNotification(new Notification({ message: $.i18n.prop("xe.extensions.json.editor.error", [e.message]),
                                         type: "error", flash: false, id: xe.extensionsParseErrorId }));
            return false;
        }
    };

    //Add the tools menu item Extensibility if we are in developer mode
    xe.addExtensibilityMenu = function () {
        if (xe.devMode()) {
            try {
                if($('#toolsMenu').html().indexOf('id="extensibility"')<0) {
                    ToolsMenu.addSection("extensibility", $.i18n.prop("xe.menu.section.extensibility"));
                }
                /* Following item needs to be implemented for non Angular pages. Disable.  */
                //ToolsMenu.addItem("pagestructurebase", "Show Baseline Page Structure", "extensibility", function () {
                //    xe.popups[0] = xe.showPageStructure(xe.page, xe.popups[0]);
                //});
                //ToolsMenu.addItem("pagestats", $.i18n.prop("xe.menu.extensions.status"), "extensibility", function () {
                //    xe.popups[1] = xe.showStats(xe.page, xe.popups[1]);
                //});
                if($('#toolsMenu').html().indexOf('id="extensionseditor"')<0) {
                    ToolsMenu.addItem("extensionseditor", $.i18n.prop("xe.menu.extensions.edit"), "extensibility", function () {
                        xe.popups[2] = xe.extensionsEditor(xe.page, xe.popups[2]);
                    });
                }
                if($('#toolsMenu').html().indexOf('id="base"')<0) {
                    ToolsMenu.addSection("base", $.i18n.prop("xe.menu.section.other"));
                }
            } catch(e) {
                xe.log('Failed to initiate Extensibility Tools menu. Exception: ' + e);
            }
        }
    };

    xe.startup = function () {
        if(extensibilityInfo.application!='BannerExtensibility') {
            if (typeof extensibilityInfo.extensions !== 'undefined' && !_.isEmpty(extensibilityInfo.extensions)) {
                xe.extensions = extensibilityInfo.extensions;
            }
            if ((xe.extensions !== undefined)) {
                xe.extensionsFound = true;
                if (xe.devMode()) {
                    xe.page.metadata = $.extend(true, {}, xe.extensions);  //clone of extensions used for editor
                }
                xe.extensions.orderedSections = xe.reorderMetadata(xe.extensions.sections);
                if (xe.extendFunctions !== undefined) {
                    xe.extendFunctions();
                }
            }
            if (xe.extensionsFound) {
                xe.log("Extensions", xe.extensions);
                xe.loadResources();
            } else {
                xe.log('No Extensibility definitions found!');
            }
            xe.addExtensibilityMenu();
        }
    };

    $(xe.startup);

    return xe;
})(xe || {});
