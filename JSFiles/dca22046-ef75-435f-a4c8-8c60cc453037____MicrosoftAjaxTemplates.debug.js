//-----------------------------------------------------------------------
// Copyright (C) Microsoft Corporation. All rights reserved.
//-----------------------------------------------------------------------
// MicrosoftAjaxTemplates.js
// Microsoft AJAX Templating Framework.

Type.registerNamespace("Sys.Preview.UI");

Sys.Application.disposeElement = function Sys$Application$disposeElement(element, childNodesOnly) {
    /// <param name="element" domElement="true"></param>
    /// <param name="childNodesOnly" type="Boolean"></param>
    var e = Function._validateParams(arguments, [
        {name: "element", domElement: true},
        {name: "childNodesOnly", type: Boolean}
    ]);
    if (e) throw e;

    this._disposeElementRecursive(element);
    if (!childNodesOnly) {
        this._disposeElementInternal(element);
    }
}
Sys.Application._disposeElementRecursive = function Sys$Application$_disposeElementRecursive(element) {
    if (element.nodeType === 1) {
        var childNodes = element.childNodes;
        for (var i = childNodes.length - 1; i >= 0; i--) {
            var node = childNodes[i];
            if (node.nodeType === 1) {
                Sys.Application._disposeElementInternal(node);
                this._disposeElementRecursive(node);
            }
        }
    }
}
Sys.Application._disposeElementInternal = function Sys$Application$_disposeElementInternal(element) {
            if (element.dispose && typeof(element.dispose) === "function") {
        element.dispose();
    }
    else if (element.control && typeof(element.control.dispose) === "function") {
        element.control.dispose();
    }
    var behaviors = Sys.UI.Behavior.getBehaviors(element);
    for (var i = behaviors.length - 1; i >= 0; i--) {
        behaviors[i].dispose();
    }
}
Sys.UI.DomElement._oldGetElementById = Sys.UI.DomElement.getElementById;
Sys.UI.DomElement.getElementById = function Sys$UI$DomElement$getElementById(id, element) {
    /// <param name="id" type="String"></param>
    /// <param name="element" domElement="true" optional="true" mayBeNull="true"></param>
    /// <returns domElement="true" mayBeNull="true"></returns>
    var e = Function._validateParams(arguments, [
        {name: "id", type: String},
        {name: "element", mayBeNull: true, domElement: true, optional: true}
    ]);
    if (e) throw e;

    var e = Sys.UI.DomElement._oldGetElementById(id, element);
    if (!e && !element && Sys.Preview.UI.Template._contexts.length) {
                var contexts = Sys.Preview.UI.Template._contexts;
        for (var i = 0, l = contexts.length; i < l; i++) {
            var context = contexts[i];
            for (var j = 0, m = context.length; j < m; j++) {
                var c = context[j];
                if (c.nodeType === 1) {
                    if (c.id === id) return c;
                    e = Sys.UI.DomElement._oldGetElementById(id, c);
                    if (e) return e;
                }
            }
        }
    }
    return e;
}
if ($get === Sys.UI.DomElement._oldGetElementById) {
    $get = Sys.UI.DomElement.getElementById;
}

Sys.UI.DomElement.isDomElement = function Sys$UI$DomElement$isDomElement(obj) {
                            var val = false;
    if (typeof(obj.nodeType) !== 'number') {
                                var doc = obj.ownerDocument || obj.document || obj;
        if (doc != obj) {
                                    var w = doc.defaultView || doc.parentWindow;
                        val = (w != obj) && !(w.document && obj.document && (w.document === obj.document));
        }
        else {
                                    val = (typeof(doc.body) === 'undefined');
        }
    }
    return !val;
}
Sys.Application.registerMarkupExtension = function Sys$Application$registerMarkupExtension(extensionName, extension, isExpression) {
    var type = Object.getType(extension);
    if (!type.implementsInterface(Sys.Preview.UI.IMarkupExtension)) {
        isExpression = ((typeof (isExpression) === "undefined") || (isExpression === true));
        extension = new Sys.Preview.UI.GenericMarkupExtension(extension, isExpression);
    }
    if (!this._extensions) {
        this._extensions = {};
    }
    this._extensions[extensionName] = extension;
}
Sys.Application._getMarkupExtension = function Sys$Application$_getMarkupExtension(name) {
    var extension = this._extensions ? this._extensions[name] : null;
    if (!extension) {
                throw Error.invalidOperation("A markup extension with the name '" + name + "' could not be found.");
    }
    return extension;
}
Sys.Preview.UI.DOMProcessor = {};
Sys.Preview.UI.DOMProcessor.processNode = function Sys$Preview$UI$DOMProcessor$processNode(element, context, recursive) {
    /// <param name="element" domElement="true"></param>
    /// <param name="context" optional="true" mayBeNull="true"></param>
    /// <param name="recursive" optional="true" mayBeNull="false"></param>
    /// <returns type="Array" elementType="Sys.Component"></returns>
    var e = Function._validateParams(arguments, [
        {name: "element", domElement: true},
        {name: "context", mayBeNull: true, optional: true},
        {name: "recursive", optional: true}
    ]);
    if (e) throw e;

    return Sys.Preview.UI.DOMProcessor._processNodeWithMappings(
        Sys.Preview.UI.DOMProcessor._getNamespaceMappings(null, [element]),
        element, context, recursive);
}
Sys.Preview.UI.DOMProcessor.processNodes = function Sys$Preview$UI$DOMProcessor$processNodes(elements, context, recursive) {
    /// <param name="elements" type="Array" elementDomElement="true"></param>
    /// <param name="context" optional="true" mayBeNull="true"></param>
    /// <param name="recursive" optional="true" mayBeNull="false"></param>
    /// <returns type="Array" elementType="Sys.Component"></returns>
    var e = Function._validateParams(arguments, [
        {name: "elements", type: Array},
        {name: "context", mayBeNull: true, optional: true},
        {name: "recursive", optional: true}
    ]);
    if (e) throw e;

    var components = [];
    for (var i = 0, l = elements.length; i < l; i++) {
        Array.addRange(components, Sys.Preview.UI.DOMProcessor.processNode(elements[i], context, recursive));
    }
    return components;
}
Sys.Preview.UI.DOMProcessor._processNodeWithMappings = function Sys$Preview$UI$DOMProcessor$_processNodeWithMappings(namespaceMappings, element, userContext, recursive) {
    var context = { userContext: userContext, localContext: {} }, components = [];
    Sys.Preview.UI.DOMProcessor._processNodeInternal(element, namespaceMappings, components, context, recursive);
    for (var i = 0, l = components.length; i < l; i++) {
        var component = components[i];
        if (Sys.Component.isInstanceOfType(component)) {
            component.endUpdate();
        }
    }
    return components;
}
Sys.Preview.UI.DOMProcessor._processNodeInternal = function Sys$Preview$UI$DOMProcessor$_processNodeInternal(element, namespaceMappings, components, context, recursive) {
        if (element.__msajaxactivated) return;
    var i, l, instance, types = null, key = null;
            try {
        types = element.getAttribute(namespaceMappings.types);
    }
    catch (err) {
    }
    try {
        key = element.getAttribute(namespaceMappings.sysKey);
    }
    catch (err) {
    }
    if (key) {
        context.localContext[key] = element;
    }
    if (types) {
        element.__msajaxactivated = true;
        var typeList = types.split(',');
                var index = {};
        var localComponents = [];
        for (i = 0, l = typeList.length; i < l; i++) {
            var typeName = typeList[i].trim();
            if (index[typeName]) continue;             var type = namespaceMappings.namespaces[typeName];
            if (type) {
                var isComponent = type.inheritsFrom(Sys.Component);
                instance = isComponent && (type.inheritsFrom(Sys.UI.Behavior) || type.inheritsFrom(Sys.UI.Control)) ?
                            new type(element) : new type();
                if (isComponent) {
                    localComponents.push(instance);
                    instance.beginUpdate();
                }
                index[typeName] = { instance: instance, typeName: typeName, type: type};
                components.push(instance);
            }
        }
                                for (i = 0, l = element.attributes.length; i < l; i++) {
            var attribute = element.attributes[i];
            if (!attribute.specified) continue;
            var nodeName = attribute.nodeName;
            if ((nodeName === namespaceMappings.sysKey) || (nodeName === namespaceMappings.types)) continue;
            var attrib = Sys.Preview.UI.DOMProcessor._splitAttribute(nodeName),
                ns = attrib.ns;
            if (!ns) continue;
            var entry = index[ns];
                        if (!entry) continue;
            if (attrib.name === "sys-key") {
                context.localContext[attribute.nodeValue] = entry.instance;
            }
            else {
                Sys.Preview.UI.DOMProcessor._setProperty(entry.instance, entry.type, attrib.name, attribute.nodeValue, context);
            }
        }
        var app = Sys.Application, creatingComponents = app.get_isCreatingComponents();
        for (i = 0, l = localComponents.length; i < l; i++) {
            instance = localComponents[i];
            if (instance.get_id()) {
                app.addComponent(instance);
            }
            if (creatingComponents) {
                app._createdComponents[app._createdComponents.length] = instance;
            }
        }
    }
    if (recursive || (typeof(recursive) === "undefined")) {
        var className = element.className;
                if (!Sys.Preview.UI.Template._isTemplate(element)) {
            for (i = 0, l = element.childNodes.length; i < l; i++) {
                var node = element.childNodes[i];
                                if (node.nodeType !== 3) {
                    Sys.Preview.UI.DOMProcessor._processNodeInternal(node, namespaceMappings, components, context, true);
                }
            }
        }
    }
}
Sys.Preview.UI.DOMProcessor._splitAttribute = function Sys$Preview$UI$DOMProcessor$_splitAttribute(attributeName) {
    var nameParts = attributeName.split(':'),
            ns = nameParts.length > 1 ? nameParts[0] : null,
            name = nameParts[ns ? 1 : 0];
    return { ns: ns, name: name };
}
Sys.Preview.UI.DOMProcessor._getBodyNamespaceMapping = function Sys$Preview$UI$DOMProcessor$_getBodyNamespaceMapping() {
    if (Sys.Preview.UI.DOMProcessor._bodyNamespaceMapping) {
        return Sys.Preview.UI.DOMProcessor._bodyNamespaceMapping;
    }
    var namespaceMapping = {
        sysNamespace: "sys", types: "sys:attach", sysId: "sys:id", sysKey: "sys:key",
        sysActivate: "sys:activate", sysChecked: "sys:checked", styleNamespace: "style",
        classNamespace: "class", namespaces: {}
    };
    Sys.Preview.UI.DOMProcessor._getNamespaceMapping(namespaceMapping, document.body);
    Sys.Preview.UI.DOMProcessor._bodyNamespaceMapping = namespaceMapping;
    return namespaceMapping;
}
Sys.Preview.UI.DOMProcessor._getNamespaceMappings = function Sys$Preview$UI$DOMProcessor$_getNamespaceMappings(existingMapping, elements) {
    var namespaceMappings = existingMapping || Sys.Preview.UI.DOMProcessor._getBodyNamespaceMapping();
    for (var i = 0, l = elements.length; i < l; i++) {
        Sys.Preview.UI.DOMProcessor._getNamespaceMapping(namespaceMappings, elements[i]);
    }
    return namespaceMappings;
}
Sys.Preview.UI.DOMProcessor._getNamespaceMapping = function Sys$Preview$UI$DOMProcessor$_getNamespaceMapping(namespaceMapping, element) {
    var attributes = element.attributes;
    for (var i = 0, l = attributes.length; i < l; i++) {
        var attribute = attributes[i];
        if (!attribute.specified) continue;
        var attrib = Sys.Preview.UI.DOMProcessor._splitAttribute(attribute.nodeName);
        if (attrib.ns !== "xmlns") continue;
        var name = attrib.name;
        var value = attribute.nodeValue.trim();
                if (value.toLowerCase().startsWith("javascript:")) {
            value = value.substr(11).trimStart();
            if (value === "Sys") {
                with(namespaceMapping) {
                    sysNamespace = name;
                    types = name + ":attach";
                    sysId = name + ":id";
                    sysChecked = name + ":checked";
                    sysActivate = name + ":activate";
                    sysKey = name + ":key";
                }
            }
            else {
                                                var type = Type.parse(value);
                if (type) {
                    namespaceMapping.namespaces[name] = type;
                }
            }
        }
        else if (value === "http://schemas.microsoft.com/aspnet/style") {
            namespaceMapping.styleNamespace = name;
        }
        else if (value === "http://schemas.microsoft.com/aspnet/class") {
            namespaceMapping.classNamespace = name;
        }
    }
}
Sys.Preview.UI.DOMProcessor._getExtensionValue = function Sys$Preview$UI$DOMProcessor$_getExtensionValue(extension, propertyName) {
    var extensionName, extensionProperties, spaceIndex = extension.indexOf(' ');
    if (spaceIndex !== -1) {
        extensionName = extension.substr(0, spaceIndex);
        extensionProperties = extension.substr(spaceIndex + 1).trim();
    }
    else {
        extensionName = extension;
        extensionProperties = null;
    }
    if (extensionProperties) {
                                extensionProperties = extensionProperties.replace(/\\,/g, '\u0000').split(/,/g);
        var propertyBag = {};
        for (var i = 0, l = extensionProperties.length; i < l; i++) {
            var extensionProperty = extensionProperties[i].replace(/\u0000/g, ','),
                    equalIndex = extensionProperty.indexOf('=');
            if (equalIndex !== -1) {
                propertyBag[extensionProperty.substr(0, equalIndex).trim()] =
                        extensionProperty.substr(equalIndex + 1).trim();
            }
            else {
                propertyBag["$default"] = extensionProperty.trim();
            }
        }
    }
    var extensionInstance = Sys.Application._getMarkupExtension(extensionName);
        var code = extensionInstance.provideValue(propertyName, propertyBag);
    return { code: code, isExpression: extensionInstance.get_isExpression() };
}
Sys.Preview.UI.DOMProcessor._setProperty = function Sys$Preview$UI$DOMProcessor$_setProperty(target, type, name, value, context) {
    var propertyValue = value, code, isExpression = true;
    if (value.startsWith("{{") && value.endsWith("}}")) {
        code = value.slice(2, -2);
    }
    else if (value.startsWith("{") && value.endsWith("}")) {
        var extensionValue = this._getExtensionValue(value.slice(1, -1), name);
        code = extensionValue.code;
        isExpression = extensionValue.isExpression;
    }
    if (code) {
        propertyValue = this._evaluateExpression(code, context);
        if (!isExpression || typeof(propertyValue) === "undefined") {
                                                return;
        }
    }
    if (name && (name !== name.toLowerCase())) {
                throw Error.invalidOperation("Declared attribute names must be in lowercase.");
    }
    if (!Sys.Preview.UI.DOMProcessor._trySet(target, type, name, propertyValue)) {
        var caseFixedName = Sys.Preview.UI.DOMProcessor._mapToPrototype(name, type);
        if (caseFixedName && (caseFixedName !== name)) {
            Sys.Preview.UI.DOMProcessor._trySet(target, type, caseFixedName, propertyValue);
        }
        else {
                                    target[name] = propertyValue;
        }
    }
}
Sys.Preview.UI.DOMProcessor._trySet = function Sys$Preview$UI$DOMProcessor$_trySet(target, type, name, value) {
                var setter = target["set_" + name];
    if (typeof(setter) === 'function') {
        setter.call(target, value);
        return true;
    }
    var adder = target["add_" + name];
    if (typeof(adder) === "function") {
        adder.call(target, new Function("sender", "args", value));
        return true;
    }
    if (typeof(target[name]) !== "undefined") {
                target[name] = value;
        return true;
    }
    return false;
}
Sys.Preview.UI.DOMProcessor._mapToPrototype = function Sys$Preview$UI$DOMProcessor$_mapToPrototype(name, type) {
        var caseIndex = Sys.Preview.UI.DOMProcessor._caseIndex[type.__typeName];
    if (!caseIndex) {
        caseIndex = {};
        type.resolveInheritance();
        for (var memberName in type.prototype) {
            if (memberName.startsWith("get_") || memberName.startsWith("set_") || memberName.startsWith("add_")) {
                memberName = memberName.substr(4);
            }
            else if(memberName.startsWith("remove_")) {
                memberName = memberName.substr(7);
            }
            caseIndex[memberName.toLowerCase()] = memberName;
        }
        Sys.Preview.UI.DOMProcessor._caseIndex[type.__typeName] = caseIndex;
    }
    return caseIndex[name.toLowerCase()];
}
Sys.Preview.UI.DOMProcessor._doEval = function Sys$Preview$UI$DOMProcessor$_doEval($expression, $context) {
    with($context.localContext) {
        with($context.userContext || {}) {
            return eval("(" + $expression + ")");
        }
    }
}
Sys.Preview.UI.DOMProcessor._evaluateExpression = function Sys$Preview$UI$DOMProcessor$_evaluateExpression($expression, $context) {
    return Sys.Preview.UI.DOMProcessor._doEval.call($context.userContext, $expression, $context);
}
Sys.Preview.UI.DOMProcessor._caseIndex = {};

Sys.Application.add_init(function() {
    var namespaceMapping = Sys.Preview.UI.DOMProcessor._getBodyNamespaceMapping();
    var activateList = document.body.getAttribute(namespaceMapping.sysActivate);
    if (!activateList) return;
    if (activateList === "*") {
        Sys.Preview.UI.DOMProcessor.processNode(document.body);
    }
    else {
        var activateIds = activateList.split(',');
        for (var i = 0, l = activateIds.length; i < l; i++) {
            var e = document.getElementById(activateIds[i].trim());
            if (e) {
                Sys.Preview.UI.DOMProcessor.processNode(e);
            }
            else {
                        throw Error.invalidOperation("Could not activate element with id '" + activateIds[i] + "', the element could not be found.");
            }
        }
    }
});
Sys.Preview.UI.Template = function Sys$Preview$UI$Template(element) {
    /// <param name="element" domElement="true"></param>
    var e = Function._validateParams(arguments, [
        {name: "element", domElement: true}
    ]);
    if (e) throw e;

    if (element._msajaxtemplate) {
                throw Error.invalidOperation("This element already has a template attached to it, use Sys.Preview.UI.Template.getTemplate instead.");
    }
    element._msajaxtemplate = this;
    this._element = element;
    this._instanceId = 0;
    this._nestedTemplates = null;
    this._createInstance = this._compile();
}

    function Sys$Preview$UI$Template$get_element() {
    if (arguments.length !== 0) throw Error.parameterCount();
        return this._element;
    }
    function Sys$Preview$UI$Template$dispose() {
        var element = this.get_element();
        if (element) {
            element._msajaxtemplate = null;
        }
        if (this._nestedTemplates) {
            for (var i = 0, l = this._nestedTemplates.length; i < l; i++) {
                this._nestedTemplates[i].dispose();
            }
            this._nestedTemplates = null;
        }
    }
    function Sys$Preview$UI$Template$_appendTextNode(code, storeElementCode, text) {
        code.push(storeElementCode + "document.createTextNode(" +
                    Sys.Serialization.JavaScriptSerializer.serialize(text) +
                    "));\n");
    }
    function Sys$Preview$UI$Template$_trySet(code, type, name, expression) {
                                type.resolveInheritance();
        var prototype = type.prototype;
        var setterName = "set_" + name, setter = prototype[setterName];
        if (typeof (setter) === 'function') {
            code.push("  $component." + setterName + "(" + expression + ");\n");
            return true;
        }
        var adderName = "add_" + name, adder = prototype["add_" + name];
        if (typeof (adder) === "function") {
                                    code.push('  $component.' + adderName + '(new Function("sender", "args", ' + expression + "));\n");
            return true;
        }
        if (typeof (prototype[name]) !== "undefined") {
                        code.push("  $component." + name + " = " + expression + ";\n");
            return true;
        }
        return false;
    }
    function Sys$Preview$UI$Template$_appendAttributeSetter(namespaceMappings, code, typeIndex, attrib, expression, isExpression, booleanValue) {
        var ns = attrib.ns, name = attrib.name;
        if (ns) {
                                                if (name && (name !== name.toLowerCase())) {
                                throw Error.invalidOperation("Invalid attribute name '" + name + "'. Declared attribute names must be in lowercase.");
            }
            if (ns === namespaceMappings.classNamespace) {
                                name = Sys.Serialization.JavaScriptSerializer.serialize(name);
                code.push("  (" + expression + ") ? Sys.UI.DomElement.addCssClass($element, " + name +
                            ") : Sys.UI.DomElement.removeCssClass($element, " + name + ");\n");
            }
            else if (ns === namespaceMappings.styleNamespace) {
                                                
                                                                                                
                code.push("  $component = $element;\n  $element.style." +
                    this._translateStyleName(name) + " = " + expression + ";\n;");
            }
            else {
                var index = typeIndex[ns];
                if (index) {
                    code.push("  $component = __componentIndex['" + ns + "'];\n");
                }
                if (name === "sys-key") {
                    code.push("  __context[" + expression + "] = $component;\n");
                }
                else {
                    if (isExpression) {
                        if (!this._trySet(code, index.type, name, expression)) {
                            var caseFixedName = Sys.Preview.UI.DOMProcessor._mapToPrototype(name, index.type);
                            if (caseFixedName && (caseFixedName !== name)) {
                                this._trySet(code, index.type, caseFixedName, expression);
                            }
                            else {
                                                                                                code.push("  $component." + name + " = " + expression + ";\n");
                            }                            
                        }
                    }
                    else {
                        code.push("  " + expression + ";\n");
                    }
                }
            }
        }
        else {
            if (isExpression) {
                var lowerName = name.toLowerCase();
                if (lowerName.startsWith('on')) {
                                        code.push("  $component = $element;\n  __f = new Function(" + expression +
                                ");\n  $element." + name + " = __f;\n");
                }
                else if (lowerName === "style") {
                                                            code.push("  $component = $element;\n  $element.style.cssText = " + expression + ";\n");
                }
                else {
                    if (booleanValue) {
                                                                        code.push("  $component = $element;\n  if (" + expression +
                                    ") {\n    __e = document.createAttribute('" + name +
                                    "');\n    __e.nodeValue = \"" + booleanValue + "\";\n    $element.setAttributeNode(__e);\n  }\n");
                    }
                    else {
                        code.push("  $component = $element;\n  __e = document.createAttribute('" + name + "');\n  __e.nodeValue = " +
                                expression + ";\n  $element.setAttributeNode(__e);\n");
                    }
                }
            }
            else {
                                                code.push("  $component = $element;\n  " + expression + ";\n");
            }
        }
    }
    function Sys$Preview$UI$Template$_translateStyleName(name) {
                if (name.indexOf('-') === -1) return name;
        var parts = name.toLowerCase().split('-');
                var newName = parts[0];
        for (var i = 1, l = parts.length; i < l; i++) {
            var part = parts[i];
            newName += part.substr(0, 1).toUpperCase() + part.substr(1);
        }
        return newName;
    }
    function Sys$Preview$UI$Template$_processAttribute(namespaceMappings, code, typeIndex, attrib, value, booleanValue) {
        value = this._getAttributeExpression(attrib, value);
        if (value !== null) {
            this._appendAttributeSetter(namespaceMappings, code, typeIndex, attrib,
                value.code, value.isExpression, booleanValue);
        }
    }
    function Sys$Preview$UI$Template$_getAttributeExpression(attrib, value) {
        var type = typeof(value);
        if (type === "undefined") return null;
        if (value === null) return { isExpression: true, code: "null" };      
        if (type === "string") {
            if (value.startsWith("{{") && value.endsWith("}}")) {
                return { isExpression: true, code: value.slice(2, -2).trim() };
            }
            else if (value.startsWith("{") && value.endsWith("}")) {
                return Sys.Preview.UI.DOMProcessor._getExtensionValue(value.slice(1, -1), attrib.name);
            }
        }
        return { isExpression: true, code: Sys.Serialization.JavaScriptSerializer.serialize(value) };
    }
    function Sys$Preview$UI$Template$_processBooleanAttribute(element, namespaceMappings, code, typeIndex, name) {
                var value, node = element.getAttributeNode(namespaceMappings.sysNamespace + ":" + name);
        if (!node) {
            node = element.getAttributeNode(name);
            var nodeValue = node ? node.nodeValue : null;
            if (nodeValue && (typeof(nodeValue) === "string") &&
                nodeValue.startsWith("{") && nodeValue.endsWith("}")) {
                                                                throw Error.invalidOperation(String.format("Attribute '{0}' does not support expressions, use 'sys:{0}' instead.", name));
            }
            if (node && (node.specified || (node.nodeValue === true))) {
                                                value = true;
            }
            else {
                return;
            }
        }
        else {
            value = node.nodeValue;
            if (value === "true") {
                value = true;
            }
            else if (value === "false") {
                return;
            }
        }
        this._processAttribute(namespaceMappings, code, typeIndex, { name: name }, value, name);
    }
    function Sys$Preview$UI$Template$_processBooleanAttributes(element, namespaceMappings, code, typeIndex, attributes) {
        var name, node, value;
        for (var i = 0, l = attributes.length; i < l; i++) {
            this._processBooleanAttribute(element, namespaceMappings, code, typeIndex, attributes[i]);
        }
    }
    function Sys$Preview$UI$Template$_getExplicitAttribute(namespaceMappings, code, typeIndex, element, name, processName) {
        var node;
        try {
            node = element.getAttributeNode(name);
        }
        catch (e) {
            return null;
        }
        if (!node || !node.specified) {
            return null;
        }
        if (processName) {
            var value = (name === "style" ? element.style.cssText : node.nodeValue);
            this._processAttribute(namespaceMappings, code, typeIndex, { name: processName }, value);
        }
        return node.nodeValue;
    }
    function Sys$Preview$UI$Template$_buildTemplateCode(namespaceMappings, element, code, depth) {
        var i, j, l, m, typeName, isInput,
            expressionRegExp = Sys.Preview.UI.Template.expressionRegExp,
            storeElementCode = "  " + (depth ? ("__p[" + depth + "].appendChild(") : "__topElements.push(");

        for (i = 0, l = element.childNodes.length; i < l; i++) {
            var childNode = element.childNodes[i], text = childNode.nodeValue;

            if (childNode.nodeType === 8) {
                if (text.startsWith('*') && text.endsWith('*')) {
                    code.push("  " + text.slice(1, -1) + "\n");
                }
                else {
                    code.push(storeElementCode + "document.createComment(" +
                        Sys.Serialization.JavaScriptSerializer.serialize(text) + "));\n");
                }
            }
            else if (childNode.nodeType === 3) {
                                                if (text.startsWith("{") && text.endsWith("}") && !text.startsWith("{{") && !text.startsWith("}}")) {
                    var expr = this._getAttributeExpression({name:"nodeValue"}, text);
                    if (expr.isExpression) {
                        code.push(storeElementCode + "document.createTextNode(" + expr.code + "));\n");
                    }
                    else {
                                                code.push(storeElementCode + '$element=$component=document.createTextNode(""));\n' + '  ' + expr.code + ';\n');
                    }
                }
                else {
                                        var match = expressionRegExp.exec(text), lastIndex = 0;
                    while (match) {
                        var catchUpText = text.substring(lastIndex, match.index);
                        if (catchUpText) {
                            this._appendTextNode(code, storeElementCode, catchUpText);
                        }
                        code.push(storeElementCode + "document.createTextNode(" + match[1] + "));\n");
                        lastIndex = match.index + match[0].length;
                        match = expressionRegExp.exec(text);
                    }
                    if (lastIndex < text.length) {
                        this._appendTextNode(code, storeElementCode, text.substr(lastIndex));
                    }
                }
            }
            else {
                var attributes = childNode.attributes,
                    typeNames = null, sysAttribute = null, typeIndex = {},
                    tagName = childNode.tagName.toLowerCase(),
                    booleanAttributes,  dp1 = depth + 1;
                isInput = (tagName === "input");
                
                if (isInput) {
                    var typeExpression = this._getAttributeExpression({ name: "type" }, childNode.getAttribute("type"));
                    var nameExpression = this._getAttributeExpression({ name: "name" }, childNode.getAttribute("name"));
                    if (!typeExpression.isExpression || !nameExpression.isExpression) {
                                                throw Error.invalidOperation("Input elements 'type' and 'name' attributes must be explictly set.");
                    }
                    code.push("  $element=__p[" + (dp1) + "]=Sys.Preview.UI.Template._createInput(" + typeExpression.code + ", " + nameExpression.code + ");\n");
                    booleanAttributes = Sys.Preview.UI.Template._inputBooleanAttributes;
                    this._processBooleanAttributes(childNode, namespaceMappings, code, typeIndex, booleanAttributes);
                }
                else {
                    code.push("  $element=__p[" + (dp1) + "]=document.createElement('" + childNode.nodeName + "');\n");
                }
                
                                typeNames = this._getExplicitAttribute(namespaceMappings, code, typeIndex, childNode, namespaceMappings.types);
                if (typeNames) {
                    typeNames = typeNames.split(',');
                    code.push("  __componentIndex = {}\n");
                                                            for (j = 0, m = typeNames.length; j < m; j++) {
                        typeName = typeNames[j].trim();
                        if (typeIndex[typeName]) continue;                         var type = namespaceMappings.namespaces[typeName];
                        if (type) {
                                                                                    var isComponent = type.inheritsFrom(Sys.Component),
                                isControlOrBehavior = (isComponent && (type.inheritsFrom(Sys.UI.Behavior) || type.inheritsFrom(Sys.UI.Control))),
                                isContext = type.implementsInterface(Sys.Preview.UI.ITemplateContext);
                            typeIndex[typeName] = { type: type, isComponent: isComponent };
                            code.push("  __components.push(__componentIndex['" + typeName + "'] = $component = new " + type.getName());
                            if (isControlOrBehavior) {
                                                                code.push("($element));\n");
                            }
                            else {
                                                                code.push("());\n");
                            }
                            if (isComponent) {
                                                                                                                                code.push("  $component.beginUpdate();\n");
                            }
                            if (isContext) {
                                code.push("  $component.set_parentContext({ dataItem: $dataItem || window, parentContext: $parentContext });\n");
                            }
                        }
                    }
                }
                
                                                                sysAttribute = this._getExplicitAttribute(namespaceMappings, code, typeIndex, childNode, namespaceMappings.sysKey);
                if (sysAttribute) {
                    code.push("  __context[" +
                                Sys.Serialization.JavaScriptSerializer.serialize(sysAttribute) + "] = $element;\n");
                }
                                this._getExplicitAttribute(namespaceMappings, code, typeIndex, childNode, namespaceMappings.sysId, "id");
                                                                this._getExplicitAttribute(namespaceMappings, code, typeIndex, childNode, "style", "style");
                this._getExplicitAttribute(namespaceMappings, code, typeIndex, childNode, "class", "class");
                
                                if (!isInput) {
                    booleanAttributes = Sys.Preview.UI.Template._booleanAttributes[tagName] ||
                        Sys.Preview.UI.Template._commonBooleanAttributes;
                    this._processBooleanAttributes(childNode, namespaceMappings, code, typeIndex, booleanAttributes);
                }
                
                for (j = 0, m = attributes.length; j < m; j++) {
                    var attribute = attributes[j], name = attribute.nodeName, lowerName = name.toLowerCase();
                                                            if (!attribute.specified && (!isInput || lowerName !== "value")) continue;
                                        if ((lowerName === "class") || (lowerName === "style")) continue;
                                        if (Array.indexOf(booleanAttributes, lowerName) !== -1) continue;
                                        if (isInput && (Array.indexOf(Sys.Preview.UI.Template._inputRequiredAttributes, lowerName) !== -1)) continue;
                    var attrib = Sys.Preview.UI.DOMProcessor._splitAttribute(name),
                        ns = attrib.ns,
                        value = attribute.nodeValue,
                        isSys = false;
                    name = attrib.name;
                    if (ns) {
                                                                        isSys = (ns === namespaceMappings.sysNamespace);
                        if (isSys) {
                                                        if (Array.indexOf(Sys.Preview.UI.Template._sysAttributes, name) !== -1) continue;
                                                                                                                                                                                                    lowerName = name.toLowerCase();
                            if ((lowerName !== "src") && (lowerName !== "href")) {
                                throw Error.invalidOperation(String.format(Sys.Preview.TemplateRes.invalidSysAttribute, attrib.ns + ":" + attrib.name));
                            }
                            attrib.ns = null;
                        }
                    }
                    this._processAttribute(namespaceMappings, code, typeIndex, attrib, value);
                }
                code.push(storeElementCode + "$element);\n");
                for (typeName in typeIndex) {
                    index = typeIndex[typeName];
                    if (index.isComponent) {
                                                code.push("  if (($component=__componentIndex['" + typeName + "']).get_id()) __app.addComponent($component);\nif (__creatingComponents) __app._createdComponents[__app._createdComponents.length] = $component;\n");
                    }
                }
                                if (Sys.Preview.UI.Template._isTemplate(childNode)) {
                                                                                                                                            var nestedTemplates = this._nestedTemplates;
                    if (!nestedTemplates) {
                        this._nestedTemplates = nestedTemplates = [];
                    }
                    nestedTemplates.push(new Sys.Preview.UI.Template(childNode));
                    code.push("  $element._msajaxtemplate = this._nestedTemplates[" + (nestedTemplates.length-1) + "];\n");
                }
                else {
                    this._buildTemplateCode(namespaceMappings, childNode, code, dp1);
                                        code.push("  $element=__p[" + (dp1) + "];\n");
                }
            }
        }
    }
    function Sys$Preview$UI$Template$_compile() {
        var element = this.get_element(),
            code = [" var __context = {}, $component, __app = Sys.Application, __creatingComponents = __app.get_isCreatingComponents(), __components = [], __componentIndex, __e, __f, __topElements = [], __p = [__containerElement], $index = __instanceId, $id = Sys.Preview.UI.Template._getIdFunction(__instanceId), $element = __containerElement;\n Sys.Preview.UI.Template._contexts.push(__topElements);\n with(__context) { with($dataItem || {}) {\n"];
        var namespaceMappings = Sys.Preview.UI.DOMProcessor._getNamespaceMappings(null, [element]);
        this._buildTemplateCode(namespaceMappings, element, code, 0);
                        code.push("} }\n  for (var __i = 0, __l = __topElements.length; __i < __l; __i++) {\n  __containerElement.appendChild(__topElements[__i]);\n }\n");
        code.push(" Sys.Preview.UI.Template._contexts.pop();\n");         code.push(" return new Sys.Preview.UI.TemplateResult(this, __containerElement, __topElements, __components);");
        code = code.join('');
        return new Function("__containerElement", "$dataItem", "$parentContext", "__instanceId", code);
    }
    function Sys$Preview$UI$Template$createInstance(container, dataItem, parentContext) {
        /// <param name="container" domElement="true"></param>
        /// <param name="dataItem" optional="true" mayBeNull="true"></param>
        /// <param name="parentContext" optional="true" mayBeNull="true"></param>
        /// <returns type="Sys.Preview.UI.TemplateResult"></returns>
        var e = Function._validateParams(arguments, [
            {name: "container", domElement: true},
            {name: "dataItem", mayBeNull: true, optional: true},
            {name: "parentContext", mayBeNull: true, optional: true}
        ]);
        if (e) throw e;

        return this._createInstance(container, dataItem, parentContext, this._instanceId++);
    }
Sys.Preview.UI.Template.prototype = {
    get_element: Sys$Preview$UI$Template$get_element,
    dispose: Sys$Preview$UI$Template$dispose,
    _appendTextNode: Sys$Preview$UI$Template$_appendTextNode,
    _trySet: Sys$Preview$UI$Template$_trySet,
    _appendAttributeSetter: Sys$Preview$UI$Template$_appendAttributeSetter,
    _translateStyleName: Sys$Preview$UI$Template$_translateStyleName,
    _processAttribute: Sys$Preview$UI$Template$_processAttribute,
    _getAttributeExpression: Sys$Preview$UI$Template$_getAttributeExpression,
    _processBooleanAttribute: Sys$Preview$UI$Template$_processBooleanAttribute,
    _processBooleanAttributes: Sys$Preview$UI$Template$_processBooleanAttributes,
    _getExplicitAttribute: Sys$Preview$UI$Template$_getExplicitAttribute,
    _buildTemplateCode: Sys$Preview$UI$Template$_buildTemplateCode,
    _compile: Sys$Preview$UI$Template$_compile,
    createInstance: Sys$Preview$UI$Template$createInstance
}
Sys.Preview.UI.Template.getTemplate = function Sys$Preview$UI$Template$getTemplate(element) {
    /// <param name="element" mayBeNull="false" domElement="true"></param>
    /// <returns type="Sys.Preview.UI.Template"></returns>
    var e = Function._validateParams(arguments, [
        {name: "element", domElement: true}
    ]);
    if (e) throw e;

    var template = element._msajaxtemplate;
    if (template) return template;
    return element._msajaxtemplate = new Sys.Preview.UI.Template(element);
}
Sys.Preview.UI.Template._getIdFunction = function Sys$Preview$UI$Template$_getIdFunction(instance) {
    return function(prefix) {
        return prefix + instance;
    }
}
Sys.Preview.UI.Template._createInput = function Sys$Preview$UI$Template$_createInput(type, name) {
    var element, dynamic = Sys.Preview.UI.Template._dynamicInputs;
    if (dynamic === true) {
        element = document.createElement('input');
        if (type) {
            element.type = type;
        }
        if (name) {
            element.name = name;
        }
    }
    else {
        var html = "<input ";
        if (type) {
            html += "type='" + type + "' ";
        }
        if (name) {
            html += "name='" + name + "' ";
        }
        html += "/>";
        try {
            element = document.createElement(html);
        }
        catch (err) {
            Sys.Preview.UI.Template._dynamicInputs = true;
            return Sys.Preview.UI.Template._createInput(type, name);
        }
        if (dynamic !== false) {
            if (element.tagName.toLowerCase() === "input") {
                Sys.Preview.UI.Template._dynamicInputs = false;
            }
            else {
                Sys.Preview.UI.Template._dynamicInputs = true;
                return Sys.Preview.UI.Template._createInput(type, name);
            }
        }
    }
    return element;
}
Sys.Preview.UI.Template._isTemplate = function Sys$Preview$UI$Template$_isTemplate(element) {
    var className = element.className;
    return (className && ((className === "sys-template") || Array.contains(className.split(' '), "sys-template")));
}
Sys.Preview.UI.Template._contexts = [];
Sys.Preview.UI.Template._inputRequiredAttributes = ["type", "name"];
Sys.Preview.UI.Template._commonBooleanAttributes = ["disabled"];
Sys.Preview.UI.Template._inputBooleanAttributes = ["disabled", "checked", "readonly"];
Sys.Preview.UI.Template._booleanAttributes = {
    "input": Sys.Preview.UI.Template._inputBooleanAttributes,
    "select": ["disabled", "multiple"],
    "option": ["disabled", "selected"],
    "img": ["disabled", "ismap"],
    "textarea": ["disabled", "readonly"]
};
Sys.Preview.UI.Template._sysAttributes = ["attach", "id", "key",
    "disabled", "checked", "readonly", "ismap", "multiple", "selected"];
Sys.Preview.UI.Template.expressionRegExp = /\{\{\s*([\w\W]*?)\s*\}\}/g;
Sys.Preview.UI.Template.registerClass("Sys.Preview.UI.Template", null, Sys.IDisposable);

Sys.Preview.UI.TemplateResult = function Sys$Preview$UI$TemplateResult(template, container, elements, components) {
    
                        this._template = template;
    this._container = container;
    this._elements = elements;
    this._components = components;
}

    function Sys$Preview$UI$TemplateResult$get_container() {
    if (arguments.length !== 0) throw Error.parameterCount();
        return this._container || null;
    }
    function Sys$Preview$UI$TemplateResult$get_components() {
    if (arguments.length !== 0) throw Error.parameterCount();
        return this._components || [];
    }
    function Sys$Preview$UI$TemplateResult$get_elements() {
    if (arguments.length !== 0) throw Error.parameterCount();
        return this._elements || [];
    }
    function Sys$Preview$UI$TemplateResult$get_template() {
    if (arguments.length !== 0) throw Error.parameterCount();
        return this._template || null;
    }
    function Sys$Preview$UI$TemplateResult$dispose() {
        var elements = this.get_elements();
        if (elements) {
            for (var i = 0, l = elements.length; i < l; i++) {
                var element = elements[i];
                if (element.nodeType === 1) {
                    Sys.Application.disposeElement(element, false);
                }
            }
        }
        this._template = null;
        this._elements = null;
        this._components = null;
        this._container = null;
    }
    function Sys$Preview$UI$TemplateResult$initializeComponents() {
        var components = this.get_components();
        if (components) {
            for (var i = 0, l = components.length; i < l; i++) {
                var component = components[i];
                if (Sys.Component.isInstanceOfType(component)) {
                    if (component.get_isUpdating()) {
                        component.endUpdate();
                    }
                    else if (!component.get_isInitialized()) {
                        component.initialize();
                    }
                }
            }
        }
    }
Sys.Preview.UI.TemplateResult.prototype = {
    get_container: Sys$Preview$UI$TemplateResult$get_container,
    get_components: Sys$Preview$UI$TemplateResult$get_components,
    get_elements: Sys$Preview$UI$TemplateResult$get_elements,
    get_template: Sys$Preview$UI$TemplateResult$get_template,
    dispose: Sys$Preview$UI$TemplateResult$dispose,
    initializeComponents: Sys$Preview$UI$TemplateResult$initializeComponents
}
Sys.Preview.UI.TemplateResult.registerClass("Sys.Preview.UI.TemplateResult", null, Sys.IDisposable);
Sys.Preview.UI.ITemplateContext = function Sys$Preview$UI$ITemplateContext() {
}

    function Sys$Preview$UI$ITemplateContext$get_parentContext() {
    if (arguments.length !== 0) throw Error.parameterCount();
        throw Error.notImplemented();
    }
    function Sys$Preview$UI$ITemplateContext$set_parentContext() {
        throw Error.notImplemented();
    }
Sys.Preview.UI.ITemplateContext.prototype = {
    get_parentContext: Sys$Preview$UI$ITemplateContext$get_parentContext,
    set_parentContext: Sys$Preview$UI$ITemplateContext$set_parentContext
}
Sys.Preview.UI.ITemplateContext.registerInterface("Sys.Preview.UI.ITemplateContext");
Sys.Preview.UI.IMarkupExtension = function Sys$Preview$UI$IMarkupExtension() {
}

    function Sys$Preview$UI$IMarkupExtension$get_isExpression() {
    if (arguments.length !== 0) throw Error.parameterCount();
        throw Error.notImplemented();
    }
    function Sys$Preview$UI$IMarkupExtension$provideValue(propertyName, properties) {
        throw Error.notImplemented();
    }
Sys.Preview.UI.IMarkupExtension.prototype = {
    get_isExpression: Sys$Preview$UI$IMarkupExtension$get_isExpression,
    provideValue: Sys$Preview$UI$IMarkupExtension$provideValue
}
Sys.Preview.UI.IMarkupExtension.registerInterface("Sys.Preview.UI.IMarkupExtension");
Sys.Preview.UI.GenericMarkupExtension = function Sys$Preview$UI$GenericMarkupExtension(provideValueFunction, isExpression) {
    this._provideValue = provideValueFunction;
    this._isExpression = isExpression;
}

    function Sys$Preview$UI$GenericMarkupExtension$get_isExpression() {
    if (arguments.length !== 0) throw Error.parameterCount();
        return this._isExpression;
    }
    function Sys$Preview$UI$GenericMarkupExtension$provideValue(propertyName, properties) {
        return this._provideValue(propertyName, properties);
    }
Sys.Preview.UI.GenericMarkupExtension.prototype = {
    get_isExpression: Sys$Preview$UI$GenericMarkupExtension$get_isExpression,
    provideValue: Sys$Preview$UI$GenericMarkupExtension$provideValue
}
Sys.Preview.UI.GenericMarkupExtension.registerClass("Sys.Preview.UI.GenericMarkupExtension", null, Sys.Preview.UI.IMarkupExtension);


Sys.Preview.BindingMode = function Sys$Preview$BindingMode() {
}





Sys.Preview.BindingMode.prototype = {
    oneTime: 0,
    oneWay: 1,
    twoWay: 2,
    oneWayToSource: 3
}
Sys.Preview.BindingMode.registerEnum("Sys.Preview.BindingMode");
Sys.Preview.Binding = function Sys$Preview$Binding() {
    Sys.Preview.Binding.initializeBase(this);
}











    function Sys$Preview$Binding$get_mode() {
        /// <value type="Sys.Preview.BindingMode" mayBeNull="false"></value>
        if (arguments.length !== 0) throw Error.parameterCount();
        return this._mode || null;
    }
    function Sys$Preview$Binding$set_mode(value) {
        var e = Function._validateParams(arguments, [{name: "value", type: Sys.Preview.BindingMode}]);
        if (e) throw e;

        if (this.get_isInitialized()) {
            throw Error.invalidOperation(String.format(Sys.Preview.TemplateRes.bindingUpdateAfterInit, "mode"));
        }
        this._mode = value;
    }
    function Sys$Preview$Binding$get_source() {
        /// <value mayBeNull="true"></value>
        if (arguments.length !== 0) throw Error.parameterCount();
        return this._source || null;
    }
    function Sys$Preview$Binding$set_source(value) {
        var e = Function._validateParams(arguments, [{name: "value", mayBeNull: true}]);
        if (e) throw e;

        if (this.get_isInitialized()) {
            throw Error.invalidOperation(String.format(Sys.Preview.TemplateRes.bindingUpdateAfterInit, "source"));
        }
        this._source = value;
    }
    function Sys$Preview$Binding$get_path() {
        /// <value type="String" mayBeNull="true"></value>
        if (arguments.length !== 0) throw Error.parameterCount();
        return this._path || null;
    }
    function Sys$Preview$Binding$set_path(value) {
        var e = Function._validateParams(arguments, [{name: "value", type: String, mayBeNull: true}]);
        if (e) throw e;

        if (this.get_isInitialized()) {
            throw Error.invalidOperation(String.format(Sys.Preview.TemplateRes.bindingUpdateAfterInit, "path"));
        }
        if (value !== this._path) {
            this._path = value;
            this._pathArray = value ? value.split('.') : null;
        }
    }
    function Sys$Preview$Binding$get_target() {
        /// <value mayBeNull="true"></value>
        if (arguments.length !== 0) throw Error.parameterCount();
        return this._target || null;
    }
    function Sys$Preview$Binding$set_target(value) {
        var e = Function._validateParams(arguments, [{name: "value", mayBeNull: true}]);
        if (e) throw e;

        if (this.get_isInitialized()) {
            throw Error.invalidOperation(String.format(Sys.Preview.TemplateRes.bindingUpdateAfterInit, "target"));
        }
        this._target = value;
    }
    function Sys$Preview$Binding$get_propertyName() {
        /// <value type="String" mayBeNull="true"></value>
        if (arguments.length !== 0) throw Error.parameterCount();
        return this._propertyName || null;
    }
    function Sys$Preview$Binding$set_propertyName(value) {
        var e = Function._validateParams(arguments, [{name: "value", type: String, mayBeNull: true}]);
        if (e) throw e;

        if (this.get_isInitialized()) {
            throw Error.invalidOperation(String.format(Sys.Preview.TemplateRes.bindingUpdateAfterInit, "propertyName"));
        }
        if (value !== this._propertyName) {
            this._propertyName = value;
            this._propertyNameArray = value ? value.split('.') : null;
        }
    }


    function Sys$Preview$Binding$_addBinding(element) {
                        if (element.nodeType === 3) {
                        element = element.parentNode;
                        if (!element) return;
        }
        var bindings = element._msajaxBindings;
        if (!bindings) {
           element._msajaxBindings = [this];
        }
        else {
           bindings.push(this);
        }
                if (typeof(element.dispose) !== "function") {
            element.dispose = Sys.Preview.Binding._disposeBindings;
        }
    }
    function Sys$Preview$Binding$_disposeHandlers(object, handlers) {
        if (handlers[0]) {
            Sys.UI.DomEvent.removeHandler(object, "click", handlers[0]);
            handlers[0] = null;
        }
        if (handlers[1]) {
            Sys.UI.DomEvent.removeHandler(object, "keyup", handlers[1]);
            handlers[1] = null;
        }
        if (handlers[2]) {
            Sys.UI.DomEvent.removeHandler(object, "change", handlers[2]);
            handlers[2] = null;
        }
        if (handlers[3]) {
            object.remove_propertyChanged(handlers[3]);
            handlers[3] = null;
        }
        if (handlers[4]) {
            object.remove_disposing(handlers[4]);
            handlers[4] = null;
        }
    }
    function Sys$Preview$Binding$dispose() {
                if(this._sourceHandlers) {
            this._disposeHandlers(this.get_source(), this._sourceHandlers);
            delete this._sourceHandlers;
        }
        if(this._targetHandlers) {
            this._disposeHandlers(this.get_target(), this._targetHandlers);
            delete this._targetHandlers;
        }
        Sys.Preview.Binding.callBaseMethod(this, 'dispose');
    }
    function Sys$Preview$Binding$_getPropertyFromIndex(obj, path, index) {
                        for (var i = 0; i <= index; i++) {
            obj = this._getPropertyData(obj, path[i]);
                                                            var type = typeof (obj);
            if ( (i < (path.length - 1)) && ((obj === null) || (type === "undefined") || 
                 (type === "number") || (type === "date") || (type === "string") || (obj instanceof Array))) {
                throw Error.invalidOperation(Sys.Preview.TemplateRes.nullReferenceInPath);
            }
        }
        return obj;
    }
    function Sys$Preview$Binding$_getPropertyData(obj, name) {
        if (typeof (obj["get_" + name]) === "function") {
            return obj["get_" + name]();
        }
        else {
            return obj[name];
        }
    }
    function Sys$Preview$Binding$_onDisposing() {
                this.dispose();
    }
    function Sys$Preview$Binding$_setPropertyData(object, name, data) {
        if (typeof (object["set_" + name]) === "function") {
            object["set_" + name](data);
        }
        else {
            object[name] = data;
        }
    }
    function Sys$Preview$Binding$update(mode) {
        /// <param name="mode" optional="true" mayBeNull="false"></param>
        var e = Function._validateParams(arguments, [
            {name: "mode", optional: true}
        ]);
        if (e) throw e;

                        if (!this.get_isInitialized()) {
            throw Error.invalidOperation(Sys.Preview.TemplateRes.updateBeforeInit);
        }
        mode = mode || this.get_mode();
        if (mode === Sys.Preview.BindingMode.oneWayToSource) {
            delete this._lastTarget; 
            this._onTargetPropertyChanged();
        }
        else{
            delete this._lastSource;
            this._onSourcePropertyChanged();
        }
    }
    function Sys$Preview$Binding$_hookEvent(object, handlers, handlerMethod, componentHandlerMethod) {
                if (Sys.UI.DomElement.isDomElement(object)) {
                        if (object.nodeType === 1) { 
                var tag = object.tagName.toLowerCase(); 
                if ((tag === "input") || (tag === "select") || (tag === "textarea")) {
                    var type = object.type;
                                        if ((tag === "input") && type && 
                        ((type.toLowerCase() === "checkbox") || (type.toLowerCase() === "radio"))) {
                            handlers[0] = Function.createDelegate(this, handlerMethod);
                            Sys.UI.DomEvent.addHandler(object, "click", handlers[0]);
                    }
                                        if(tag === "select") {
                        handlers[1] = Function.createDelegate(this, handlerMethod);
                        Sys.UI.DomEvent.addHandler(object, "keyup", handlers[1]);
                    }
                    handlers[2] = Function.createDelegate(this, handlerMethod);
                    Sys.UI.DomEvent.addHandler(object, "change", handlers[2]);
                    this._addBinding(object);
                }
                else {
                    throw Error.invalidOperation(Sys.Preview.TemplateRes.bindingNonInputElement);
                }
            }
            else {
                throw Error.invalidOperation(Sys.Preview.TemplateRes.bindingNonInputElement);
            }
        }
        else {
                                                if (Sys.INotifyPropertyChange.isImplementedBy(object)) { 
                handlers[3] = Function.createDelegate(this, componentHandlerMethod);
                object.add_propertyChanged(handlers[3]);
            }
            if (Sys.INotifyDisposing.isImplementedBy(object)) {
                handlers[4] = Function.createDelegate(this, this._onDisposing);
                object.add_disposing(handlers[4]);
            }
        }
    }

    function Sys$Preview$Binding$initialize() {
                                var source = this.get_source(), target = this.get_target(), mode = this.get_mode();
        if (this.get_isInitialized()) {
            throw Error.invalidOperation(Sys.Preview.TemplateRes.initializeAfterInit);
        }
                var msg = Sys.Preview.TemplateRes.bindingPropertyNotSet;
        if (!source) {
            throw Error.invalidOperation(String.format(msg,"source"));
        }
        if (!target) {
            throw Error.invalidOperation(String.format(msg,"target"));
        }
        if (!this.get_path()) {
            throw Error.invalidOperation(String.format(msg,"path"));
        }
        if (!this.get_propertyName()) {
            throw Error.invalidOperation(String.format(msg,"propertyName"));
        }
        Sys.Preview.Binding.callBaseMethod(this, 'initialize');
        
                this.update(mode);

                if (mode !== Sys.Preview.BindingMode.oneWayToSource) {
            this._sourceHandlers = [];
            this._hookEvent(source, this._sourceHandlers, this._onSourcePropertyChanged, 
                            this._onComponentSourceChanged);
        }
        else {
            if (Sys.UI.DomElement.isDomElement(source)) {
                this._addBinding(source);
            }
        }
                if (mode !== Sys.Preview.BindingMode.oneWay) {
            this._targetHandlers = [];
            this._hookEvent(target, this._targetHandlers, this._onTargetPropertyChanged, 
                            this._onComponentTargetChanged);
        }
        else {
            if (Sys.UI.DomElement.isDomElement(target)) {
                this._addBinding(target);
            }
        }
    }
    function Sys$Preview$Binding$_onComponentSourceChanged(sender, args) {
        if (args.get_propertyName() === this._pathArray[0]) {
            this._onSourcePropertyChanged();
        }
    }
    function Sys$Preview$Binding$_onComponentTargetChanged(sender, args) {
        if (args.get_propertyName() === this._propertyNameArray[0]) {
            this._onTargetPropertyChanged();
        }
    }
    function Sys$Preview$Binding$_onSourcePropertyChanged() {
                var source = this._getPropertyFromIndex(this.get_source(), this._pathArray, 
                                                this._pathArray.length - 1);
        if (!this._updateSource && (source !== this._lastSource)) {
            try {
                this._updateTarget = true;
                var targetArrayLength = this._propertyNameArray.length, 
                    target = this._getPropertyFromIndex(this.get_target(), this._propertyNameArray, 
                                                        targetArrayLength - 2);
                    this._setPropertyData(target, this._propertyNameArray[targetArrayLength - 1], source);
                this._lastSource = source;
                this._lastTarget = source;
            }
            finally {
                this._updateTarget = false;
            }
        }
    }
    function Sys$Preview$Binding$_onTargetPropertyChanged() {
                var target = this._getPropertyFromIndex(this.get_target(), this._propertyNameArray, 
                                                this._propertyNameArray.length - 1);
        if (!this._updateTarget && (target !== this._lastTarget)) {
            try {
                this._updateSource = true;
                var sourceArrayLength = this._pathArray.length,
                    source = this._getPropertyFromIndex(this.get_source(), this._pathArray, 
                                                        sourceArrayLength - 2);
                    this._setPropertyData(source, this._pathArray[sourceArrayLength - 1], target);
                this._lastTarget = this._lastSource = target;
            }
            finally {
                this._updateSource = false;
            }
        }
    }
Sys.Preview.Binding.prototype = {
    _mode: Sys.Preview.BindingMode.oneWay,
    _path: null,
    _propertyName: null,
    _source: null,
    _sourceHandlers: null,
    _target: null,
    _targetHandlers: null,
    _updateSource: false,
    _updateTarget: false,
        get_mode: Sys$Preview$Binding$get_mode,
    set_mode: Sys$Preview$Binding$set_mode,
    get_source: Sys$Preview$Binding$get_source,
    set_source: Sys$Preview$Binding$set_source,
    get_path: Sys$Preview$Binding$get_path,
    set_path: Sys$Preview$Binding$set_path,
    get_target: Sys$Preview$Binding$get_target,
    set_target: Sys$Preview$Binding$set_target,
    get_propertyName: Sys$Preview$Binding$get_propertyName,
    set_propertyName: Sys$Preview$Binding$set_propertyName,

        _addBinding: Sys$Preview$Binding$_addBinding,
    _disposeHandlers: Sys$Preview$Binding$_disposeHandlers,
    dispose: Sys$Preview$Binding$dispose,
    _getPropertyFromIndex: Sys$Preview$Binding$_getPropertyFromIndex,
    _getPropertyData: Sys$Preview$Binding$_getPropertyData,
    _onDisposing: Sys$Preview$Binding$_onDisposing,
    _setPropertyData: Sys$Preview$Binding$_setPropertyData,
    update: Sys$Preview$Binding$update,
    _hookEvent: Sys$Preview$Binding$_hookEvent,
        initialize: Sys$Preview$Binding$initialize,
    _onComponentSourceChanged: Sys$Preview$Binding$_onComponentSourceChanged,
    _onComponentTargetChanged: Sys$Preview$Binding$_onComponentTargetChanged,
    _onSourcePropertyChanged: Sys$Preview$Binding$_onSourcePropertyChanged,
    _onTargetPropertyChanged: Sys$Preview$Binding$_onTargetPropertyChanged
}
Sys.Preview.Binding.bind = function Sys$Preview$Binding$bind(target, propertyName, source, path, mode) {
    /// <param name="source" mayBeNull="false"></param>
    /// <param name="path" type="String" mayBeNull="false"></param>
    /// <param name="target" mayBeNull="false"></param>
    /// <param name="propertyName" type="String" mayBeNull="false"></param>
    /// <param name="mode" type="Sys.Preview.BindingMode" mayBeNull="false"></param>
    var e = Function._validateParams(arguments, [
        {name: "source"},
        {name: "path", type: String},
        {name: "target"},
        {name: "propertyName", type: String},
        {name: "mode", type: Sys.Preview.BindingMode}
    ]);
    if (e) throw e;

    var binding = new Sys.Preview.Binding();
    binding.set_source(source);
    binding.set_path(path);
    binding.set_target(target);
    binding.set_propertyName(propertyName);
    binding.set_mode(mode);
    binding.initialize();
    return binding;
}
Sys.Preview.Binding._disposeBindings = function Sys$Preview$Binding$_disposeBindings() {
        var bindings = this._msajaxBindings;    
    if (bindings) {
        for(var i = 0, l = bindings.length; i < l; i++) {
            bindings[i].dispose();
        }
    }
    this._msajaxBindings = null;
    
        if (this.control && typeof(this.control.dispose) === "function") {
        this.control.dispose();
    }

    if (this.dispose === Sys.Preview.Binding._disposeBindings) {
        this.dispose = null;
    }
}
Sys.Preview.Binding.registerClass("Sys.Preview.Binding", Sys.Component);

Sys.Application.registerMarkupExtension("binding", function(propertyName, properties) {
    var path = (properties["$default"] || properties["path"] || null);
    var mode = properties["mode"] || "twoWay";
        return "Sys.Preview.Binding.bind($component, " +
            Sys.Serialization.JavaScriptSerializer.serialize(propertyName) +
            ", " + (properties["source"] || "$dataItem") + ", " +
            Sys.Serialization.JavaScriptSerializer.serialize(path) +
            ", Sys.Preview.BindingMode." +
            mode +
            ");";
}, false);
Sys.Preview.UI.DataView = function Sys$Preview$UI$DataView(element) {
    /// <param name="element"></param>
    var e = Function._validateParams(arguments, [
        {name: "element"}
    ]);
    if (e) throw e;

    Sys.Preview.UI.DataView.initializeBase(this, [element]);
}








    function Sys$Preview$UI$DataView$add_itemCreated(handler) {
    var e = Function._validateParams(arguments, [{name: "handler", type: Function}]);
    if (e) throw e;

        this.get_events().addHandler("itemCreated", handler);
    }
    function Sys$Preview$UI$DataView$remove_itemCreated(handler) {
    var e = Function._validateParams(arguments, [{name: "handler", type: Function}]);
    if (e) throw e;

        this.get_events().removeHandler("itemCreated", handler);
    }
    function Sys$Preview$UI$DataView$get_data() {
        /// <value mayBeNull="true"></value>
        if (arguments.length !== 0) throw Error.parameterCount();
        return this._data;
    }
    function Sys$Preview$UI$DataView$set_data(value) {
        var e = Function._validateParams(arguments, [{name: "value", mayBeNull: true}]);
        if (e) throw e;

        if (this._data !== value) {
            this._data = value;
            this._dirty = true;
            if (this._isActive()) {
                this.raisePropertyChanged("data");
                this.render();
            }
            else {
                this._changed = this._dirty = true;
            }
        }
    }
    function Sys$Preview$UI$DataView$get_itemPlaceholder() {
        /// <value domElement="true" mayBeNull="true"></value>
        if (arguments.length !== 0) throw Error.parameterCount();
        return this._placeholder || null;
    }
    function Sys$Preview$UI$DataView$set_itemPlaceholder(value) {
        var e = Function._validateParams(arguments, [{name: "value", mayBeNull: true}]);
        if (e) throw e;

                var e = Function._validateParams(arguments, [
            {name: "value", domElement: true, mayBeNull: true}
        ]);
        if (e) throw e;
        if (this._placeholder !== value) {
            this._placeholder = value;
            this._dirty = true;
            this.raisePropertyChanged("itemPlaceholder");
        }
    }
    function Sys$Preview$UI$DataView$get_parentContext() {
        /// <value mayBeNull="true"></value>
        if (arguments.length !== 0) throw Error.parameterCount();
        return this._parentContext || null;
    }
    function Sys$Preview$UI$DataView$set_parentContext(value) {
        var e = Function._validateParams(arguments, [{name: "value", mayBeNull: true}]);
        if (e) throw e;

        if (this._parentContext !== value) {
            this._parentContext = value;
            this._dirty = true;
            this.raisePropertyChanged("parentContext");
        }
    }
    function Sys$Preview$UI$DataView$get_template() {
        /// <value mayBeNull="true"></value>
        if (arguments.length !== 0) throw Error.parameterCount();
        return this._template || null;
    }
    function Sys$Preview$UI$DataView$set_template(value) {
        var e = Function._validateParams(arguments, [{name: "value", mayBeNull: true}]);
        if (e) throw e;

        if (this._template !== value) {
            if (value &&
                !Sys.Preview.UI.Template.isInstanceOfType(value) &&
                !Sys.UI.DomElement.isDomElement(value)) {
                throw Error.argument("value", Sys.Preview.TemplateRes.invalidTemplateValue);
            }
            this._template = value;
            this._dirty = true;
            if (this._isActive()) {
                this.raisePropertyChanged("template");
                this.render();
            }
            else {
                this._changed = this._dirty = true;
            }
        }
    }
    function Sys$Preview$UI$DataView$_elementContains(container, element) {
        while (element) {
            if (element === container) return true;
            element = element.parentNode;
        }
        return false;
    }
    function Sys$Preview$UI$DataView$_getTemplateAndPlaceholder() {
                        var template = this.get_template(),
            placeholder = this.get_itemPlaceholder(),
            element = this.get_element();
        if (!template) {
            return { template: Sys.Preview.UI.Template.getTemplate(element), placeholder: element };
        }
        if (!Sys.Preview.UI.Template.isInstanceOfType(template)) {
            template = Sys.Preview.UI.Template.getTemplate(template);
        }
        if (!placeholder) {
                        if (this._elementContains(element, template.get_element())) {
                                placeholder = template.get_element();
            }
            else {
                                                var id = this.get_id();
                if (id) {
                    placeholder = Sys.UI.DomElement.getElementById(id + "_item", this.get_element());
                }
            }
        }
        return { template : template, placeholder: (placeholder || element) };
    }
    function Sys$Preview$UI$DataView$_initializeResults() {
        for (var i = 0, l = this._results.length; i < l; i++) {
            this._results[i].initializeComponents();
        }
    }
    function Sys$Preview$UI$DataView$_isActive() {
        return (this.get_isInitialized() && !this.get_isUpdating());
    }
    function Sys$Preview$UI$DataView$_raiseItemCreated(args) {
        this.onItemCreated(args);
        var handler = this.get_events().getHandler("itemCreated");
        if (handler) {
            handler(this, args);
        }
    }
    function Sys$Preview$UI$DataView$initialize() {
        if (arguments.length !== 0) throw Error.parameterCount();
        Sys.Preview.UI.DataView.callBaseMethod(this, "initialize");
        this.render();
    }
    function Sys$Preview$UI$DataView$onItemCreated(args) {
        /// <param name="args" type="Sys.Preview.UI.DataViewItemEventArgs"></param>
        var e = Function._validateParams(arguments, [
            {name: "args", type: Sys.Preview.UI.DataViewItemEventArgs}
        ]);
        if (e) throw e;

    }
    function Sys$Preview$UI$DataView$render() {
        if (arguments.length !== 0) throw Error.parameterCount();
        this._dirty = false;
        var taph = this._getTemplateAndPlaceholder(),
            template = taph.template,
            placeholder = taph.placeholder,
            data = this.get_data(),
            pctx = this.get_parentContext(),
            result;
        if (!template || !placeholder) return;
        Sys.Application.disposeElement(placeholder, true);
        placeholder.innerHTML = "";
        if (template.get_element() === placeholder) {
            Sys.UI.DomElement.removeCssClass(placeholder, "sys-template");
        }
        var parent = placeholder, element = this.get_element(), isChild = false;
        while (parent) {
            if (parent == element) {
                isChild = true;
                break;
            }
            parent = parent.parentNode;
        }
        if (!isChild) {
            throw Error.invalidOperation(Sys.Preview.TemplateRes.misplacedPlaceholder);
        }
        if ((data === null) || (typeof(data) === "undefined")) {
            this._results = [];
        }
        else if (data instanceof Array) {
            var len = data.length;
            this._results = new Array(len);
            for (var i = 0, l = len; i < l; i++) {
                var item = data[i];
                result = template.createInstance(placeholder, item, pctx);
                this._raiseItemCreated(new Sys.Preview.UI.DataViewItemEventArgs(item, result));
                this._results[i] = result;
            }
        }
        else {
            result = template.createInstance(placeholder, data, pctx);
            this.onItemCreated(new Sys.Preview.UI.DataViewItemEventArgs(data, result));
            this._results = [result];
        }
        this._initializeResults();
    }
    function Sys$Preview$UI$DataView$updated() {
        if (arguments.length !== 0) throw Error.parameterCount();
        if (this._changed) {
            this.raisePropertyChanged("");
            this._changed = false;
        }
        if (this._dirty) {
            this.render();
        }
    }
Sys.Preview.UI.DataView.prototype = {
    _data: null,
    _template: null,
    _parentContext: null,
    _results: null,
    _changed: false,
    _dirty: false,
    
    add_itemCreated: Sys$Preview$UI$DataView$add_itemCreated,
    remove_itemCreated: Sys$Preview$UI$DataView$remove_itemCreated,
    get_data: Sys$Preview$UI$DataView$get_data,
    set_data: Sys$Preview$UI$DataView$set_data,
    get_itemPlaceholder: Sys$Preview$UI$DataView$get_itemPlaceholder,
    set_itemPlaceholder: Sys$Preview$UI$DataView$set_itemPlaceholder,
    get_parentContext: Sys$Preview$UI$DataView$get_parentContext,
    set_parentContext: Sys$Preview$UI$DataView$set_parentContext,    
    get_template: Sys$Preview$UI$DataView$get_template,
    set_template: Sys$Preview$UI$DataView$set_template,
    _elementContains: Sys$Preview$UI$DataView$_elementContains,
    _getTemplateAndPlaceholder: Sys$Preview$UI$DataView$_getTemplateAndPlaceholder,
    _initializeResults: Sys$Preview$UI$DataView$_initializeResults,    
    _isActive: Sys$Preview$UI$DataView$_isActive,
    _raiseItemCreated: Sys$Preview$UI$DataView$_raiseItemCreated,
    initialize: Sys$Preview$UI$DataView$initialize,
    onItemCreated: Sys$Preview$UI$DataView$onItemCreated,
    render: Sys$Preview$UI$DataView$render,
    updated: Sys$Preview$UI$DataView$updated    
}
Sys.Preview.UI.DataView.registerClass("Sys.Preview.UI.DataView", Sys.UI.Control, Sys.Preview.UI.ITemplateContext);
Sys.Preview.UI.DataViewItemEventArgs = function Sys$Preview$UI$DataViewItemEventArgs(dataItem, templateResult) {
    Sys.Preview.UI.DataViewItemEventArgs.initializeBase(this);
    this._result = templateResult || null;
    this._data = dataItem || null;
}

    function Sys$Preview$UI$DataViewItemEventArgs$get_dataItem() {
        if (arguments.length !== 0) throw Error.parameterCount();
        return this._data;
    }
    function Sys$Preview$UI$DataViewItemEventArgs$get_templateResult() {
        if (arguments.length !== 0) throw Error.parameterCount();
        return this._result;
    }
Sys.Preview.UI.DataViewItemEventArgs.prototype = {
    get_dataItem: Sys$Preview$UI$DataViewItemEventArgs$get_dataItem,
    get_templateResult: Sys$Preview$UI$DataViewItemEventArgs$get_templateResult
}
Sys.Preview.UI.DataViewItemEventArgs.registerClass("Sys.Preview.UI.DataViewItemEventArgs", Sys.EventArgs);
Sys.Preview.TemplateRes = {
    "bindingUpdateAfterInit":"Binding '{0}' cannot be set after initialize.",
    "bindingPropertyNotSet":"Binding '{0}' must be set prior to initialize.",
    "bindingNonInputElement":"Bindings with element can only be bound to elements textarea, select, or input.",
    "initializeAfterInit":"Initialize cannot be called more than once.",
    "invalidSysAttribute":"Invalid attribute '{0}'.",
    "invalidTemplateValue":"Must be a DOM Element or instance of Sys.Preview.UI.Template.",
    "misplacedPlaceholder":"DataView item placeholder must be a child element of the DataView.",
    "updateBeforeInit":"Update cannot be called before initialize.",
    "nullReferenceInPath":"Null reference while evaluating data path."
};
