'use strict';

require('norman-server-tp');
var commonBuilder = require('../builderUtils.js');
var fs = require('fs');
var path = require('path');
var _ = require('norman-server-tp').lodash;


var vocabularies = {};
var annotationStructure = {};
var dataModelExtension = {};
var qualifierPerPath = {};
var virtualEntityId = 0;
var isInitialized = false;
/** Load the template file once at the start of the server **/
exports.initialize = function (done) {
    if (!isInitialized) {
        fs.readFile(path.resolve(__dirname, 'odata/vocabularies.json'), 'utf-8', function (err, fileData) {
            vocabularies = JSON.parse(fileData);
            isInitialized = true;
            done();
        });
    }
    else {
        done();
    }
};

exports.reset = function () {
    annotationStructure = {};
    dataModelExtension = {};
    qualifierPerPath = {};
    virtualEntityId = 0;
};

exports.getDataModelExtension = function () {
    return dataModelExtension;
};

exports.initializeModelExtension = function (entityName) {
    if (!dataModelExtension[entityName]) {
        dataModelExtension[entityName] = {};
    }
};

exports.getCurrentAnnotation = function () {
    return annotationStructure;
};

exports.findTerm = function (completeTermName) {
    var lastDot = completeTermName.lastIndexOf('.');
    var annotationNamespace = completeTermName.substr(0, lastDot);
    var targetVocabulary = vocabularies[annotationNamespace];
    var foundTerm = null;

    if (targetVocabulary) {
        var termName = completeTermName.substr(lastDot + 1);
        foundTerm = targetVocabulary.Terms[termName];
        if (completeTermName.indexOf('Collection') === 0) {
            foundTerm.isAbstract = true;
        }
    }
    return foundTerm;
};

exports.findType = function (completeTypeName) {
    var lastDot = completeTypeName.lastIndexOf('.');
    var annotationNamespace = completeTypeName.substr(0, lastDot);
    var typeName = completeTypeName.substr(lastDot + 1);

    var targetVocabulary = vocabularies[annotationNamespace];
    var foundComplexType = null;
    if (targetVocabulary) {
        foundComplexType = targetVocabulary.Types[typeName];
    }
    else if (annotationNamespace === 'Edm') {
        foundComplexType = {IsSimple: true, FullType: completeTypeName, Type: typeName};
    }

    if (foundComplexType.BaseType !== undefined) {
        var parentType = this.findType(foundComplexType.BaseType);
        foundComplexType = _.merge(_.clone(parentType, true), foundComplexType);
    }
    return foundComplexType;
};


exports.findDescendants = function (targetVocabulary, completeTypeName) {
    var self = this;
    var result = [];
    var children = _.filter(targetVocabulary.Types, function (typeValue) {
        return typeValue.FullBaseType === completeTypeName;
    });
    if (children && children.length > 0) {
        _.each(children, function (child) {
            result = result.concat(self.findDescendants(targetVocabulary, child.FullType));
        });
    }

    return result.concat(children);
};

exports.findChildTypeWithProperty = function (completeTypeName, additionalProperty) {
    // Let's look for type whose base Type is the original one and that has the right property
    var lastDot = completeTypeName.lastIndexOf('.');
    var annotationNamespace = completeTypeName.substr(0, lastDot);
    var targetVocabulary = vocabularies[annotationNamespace];
    var descendants = this.findDescendants(targetVocabulary, completeTypeName);
    var potentialType = _.find(descendants, function (typeValue) {
        return typeValue.properties[additionalProperty] !== undefined;
    });
    if (potentialType && potentialType.BaseType !== undefined) {
        var parentType = this.findType(potentialType.BaseType);
        potentialType = _.merge(_.clone(parentType, true), potentialType);
    }
    if (!potentialType) {
        // Since we can't find anything let's create a dummy structure with the additional property to merge it back with the parent
        potentialType = {
            FullType: completeTypeName,
            properties: {}
        };
        potentialType.properties[path] = {
            CollectionType: '',
            Name: path,
            Nullable: true,
            Type: 'Edm.String'
        };
    }
    return potentialType;
};

exports.createStructure = function (vocabularyType, structureName, entityName, isCollection, objectIndex) {
    var structure = {};
    structure.type = vocabularyType.FullType;
    structure.isSimple = vocabularyType.IsSimple || false;
    structure.isEnum = vocabularyType.IsEnum || false;
    structure.name = structureName;
    structure.entityName = entityName;
    structure.annotations = {};
    if (!isCollection) {
        if (structure.isSimple) {
            structure.value = null;
        }
        else {
            structure.properties = {};
            _.each(vocabularyType.properties, function (propertyValue) {
                structure.properties[propertyValue.Name] = null;
            });
        }

    }
    else {
        structure.isCollection = true;
        structure.records = [];
    }
    if (objectIndex !== undefined && objectIndex !== 0) {
        structure.qualifier = objectIndex;
    }
    return structure;
};

/**
 *
 * @param currentStructure
 * @param vocabularyType
 * @param vocabularyTerm
 * @param qualifier
 * @param prevIdx
 * @param entityName In some case the structure doesn't contain the entityName so we can pass it
 * @returns {*}
 */
exports.getStructureFor = function (currentStructure, vocabularyType, vocabularyTerm, qualifier, prevIdx, entityName) {
    var self = this;

    // In case we are not looking at a collection but sitll have different index this means that we are iterating over
    // some vocabulary term without a Collection / Repeat. In that case we use the qualifiers
    var termName = vocabularyTerm.Name;
    if (qualifier !== undefined && qualifier !== 0) {
        termName += '#' + qualifier;
    }
    var existingStructure = currentStructure[termName];
    if (!existingStructure) {
        existingStructure = currentStructure[termName] = self.createStructure(vocabularyType, vocabularyTerm.FullName, currentStructure.entityName || entityName, vocabularyTerm.IsCollection, qualifier);
    }

    if (prevIdx !== undefined && vocabularyTerm.IsCollection) {
        var realIndex = prevIdx;
        var offsetIndex = 0;
        var newStructure = null;
        _.each(existingStructure.records, function (record) {
            if (self.isTypeCompatible(record.type, vocabularyType)) {
                realIndex--;
            }
            else {
                offsetIndex++;
            }
            if (realIndex === -1) {
                newStructure = record;
            }
        });
        if (!newStructure) {
            existingStructure.records[offsetIndex + prevIdx] = self.createStructure(vocabularyType, vocabularyTerm.FullName, currentStructure.entityName || entityName, false, offsetIndex + prevIdx);
            existingStructure = existingStructure.records[offsetIndex + prevIdx];
        }
        else {
            existingStructure = newStructure;
        }
    }

    return existingStructure;
};

var RESOLVE_KEYWORD = /^sap\.ui\.model\.odata\.AnnotationHelper\.resolvePath\(([^)]+)\)/i;
var MODEL_KEYWORD = /^([^>]+)>(.*)$/i;
var reservedModelName = ['meta', 'entitySet', 'entityType'];

exports.extractTargetVariable = function (annotationName) {
    var resolveMatch = RESOLVE_KEYWORD.exec(annotationName);
    var targetVariable = null;
    if (resolveMatch !== null) {
        var modelMatch = MODEL_KEYWORD.exec(resolveMatch[1]);
        if (modelMatch !== null) {
            targetVariable = {model: modelMatch[1], path: modelMatch[2]};
        }
    }
    return targetVariable;
};

exports.extractModelVariable = function (annotationName) {
    var targetVariable = null;
    var modelMatch = MODEL_KEYWORD.exec(annotationName);
    if (modelMatch !== null) {
        targetVariable = modelMatch[1];
    }
    return targetVariable;
};

var _parseAnnotationName = function (annotationName, variableMap, currentIndex, repeatType, termInfo) {
    var annotationPath = [];
    var resolveMatch = RESOLVE_KEYWORD.exec(annotationName);
    if (resolveMatch !== null) {
        annotationPath = annotationPath.concat(_parseAnnotationName(resolveMatch[1], variableMap));
        annotationPath[annotationPath.length - 1].resolved = true;
        if (currentIndex !== undefined) {
            annotationPath[annotationPath.length - 1].idx = currentIndex;
        }
        if (repeatType !== undefined) {
            annotationPath[annotationPath.length - 1].repeatType = repeatType;
        }
        if (termInfo !== undefined) {
            annotationPath[annotationPath.length - 1].termInfo = termInfo;
        }
    }
    else {
        var splitPath = annotationName.split('/');
        var pathObj;
        _.each(splitPath, function (subAnnotationName) {
            var modelMatch = MODEL_KEYWORD.exec(subAnnotationName);
            if (modelMatch !== null && _.contains(reservedModelName, modelMatch[1])) {
                subAnnotationName = modelMatch[2];
                modelMatch = null;
            }
            if (modelMatch !== null) {
                var modelVar = variableMap[modelMatch[1]];
                var modelIndex = (modelVar.idx !== undefined) ? modelVar.idx : currentIndex;
                var modelRepeat = (modelVar.repeatType !== undefined) ? modelVar.repeatType : repeatType;
                var modelTarget = (modelVar.termInfo !== undefined) ? modelVar.termInfo : termInfo;
                annotationPath = annotationPath.concat(_parseAnnotationName(modelVar.path, variableMap, modelIndex, modelRepeat, modelTarget));
                if (modelMatch[2] !== '') {
                    pathObj = {path: modelMatch[2]};
                    if (currentIndex !== undefined) {
                        pathObj.idx = currentIndex;
                    }
                    if (repeatType !== undefined) {
                        pathObj.repeatType = repeatType;
                    }
                    if (termInfo !== undefined) {
                        pathObj.termInfo = termInfo;
                    }
                    annotationPath.push(pathObj);
                }
            }
            else {
                pathObj = {path: subAnnotationName};
                if (currentIndex !== undefined) {
                    pathObj.idx = currentIndex;
                }
                if (repeatType !== undefined) {
                    pathObj.repeatType = repeatType;
                }
                if (termInfo !== undefined) {
                    pathObj.termInfo = termInfo;
                }
                annotationPath.push(pathObj);
            }
        });
    }
    return annotationPath;
};

exports.getAnnotationDepth = function (annotationValue, variableMap) {
    var annotationName = (annotationValue.model !== '') ? annotationValue.model + '>' + annotationValue.path : annotationValue.path;
    var annotationPath = _parseAnnotationName(annotationName, variableMap);
    return annotationPath.length;
};

exports.getBaseAnnotation = function (annotationName, variableMap) {
    var annotationPath = _parseAnnotationName(annotationName, variableMap);
    return annotationPath[0];
};

var _getNewQualifier = function (entityPath) {
    if (!qualifierPerPath[entityPath]) {
        qualifierPerPath[entityPath] = 0;
    }
    return qualifierPerPath[entityPath]++;
};

var _createNavigationInfo = function (entityId, navigationPropertyId) {
    var entitySetName = '',
        navPropName = '',
        referentialConstraint,
        entity = commonBuilder.getEntityById(entityId); // get entity object by Id

    // use the entity to get the name of the entitySet and the propertyId for navigation
    if (entity) {
        // find the navigation property we want
        var navigationProperty = _.find(entity.navigationProperties, function (property) {
            return property._id === navigationPropertyId;
        });
        if (navigationProperty) {
            // find the ref constraint for the source entity
            referentialConstraint = _.find(navigationProperty.referentialConstraints, function (refContraint) {
                return refContraint.entityId === entityId;
            });
            if (referentialConstraint) {
                // get the property name from the source entity
                navPropName = commonBuilder.retrievePropertyName(entityId, referentialConstraint.propertyRef);
            }
            // find the target entity from the other ref constraint
            referentialConstraint = _.find(navigationProperty.referentialConstraints, function (refContraint) {
                return refContraint.entityId !== entityId;
            });
            if (referentialConstraint) {
                // get the nameset of the target entity
                entitySetName = commonBuilder.retrieveEntityName(referentialConstraint.entityId, true); // true gets the nameset rather the name
            }
            else {
                // In the case we have a self referential navProperty this might happen
                entitySetName = entity.nameSet;
            }
        }
    }
    return {entitySetName: entitySetName, navigationPropertyName: navPropName};
};

exports.createEntity = function () {
    var entityName = 'Entity_' + virtualEntityId; // create next entity name
    // ensure that an existing entity does not have the same name
    while (commonBuilder.getEntityByName(entityName) !== undefined) {
        entityName += '_' + virtualEntityId; // will create entity names such as 'Entity_1_1_1'
    }
    virtualEntityId++; // increment global count
    if (!dataModelExtension[entityName]) {
        dataModelExtension[entityName] = {};
    }
    return {id: entityName, name: entityName, nameSet: entityName + 'Set'};
};

exports.createExtraProperty = function (entityName, propertyName, isNavProp, toEntityId, isMultiple) {
    var newPropertyName = propertyName;
    if (isNavProp && propertyName === '') {
        newPropertyName = 'Nav_To_' + toEntityId;
    }
    newPropertyName = newPropertyName.replace(/ /, '_'); // remove spaces
    var propertyCount = 1;
    // ensure that an existing entity does not have the same property name
    while (commonBuilder.hasPropertyName(entityName, newPropertyName)) {
        newPropertyName = propertyName + '_' + propertyCount++; // will create property names such as 'Name_2'
    }
    // Initialize dataModel Extension for this property
    if (!dataModelExtension[entityName]) {
        dataModelExtension[entityName] = {};
    }
    dataModelExtension[entityName][newPropertyName] = {
        label: propertyName
    };
    if (isNavProp) {
        dataModelExtension[entityName][newPropertyName].isNavProp = isNavProp;
        dataModelExtension[entityName][newPropertyName].toEntityId = toEntityId;
        dataModelExtension[entityName][newPropertyName].isMultiple = isMultiple;
    }

    return newPropertyName;
};

exports.isTypeCompatible = function (recordType, newType) {
    var isCompatible = (recordType === newType.FullType || recordType === newType.FullBaseType);
    if (!isCompatible && newType.FullBaseType) {
        var parentType = this.findType(newType.FullBaseType);
        if (parentType) {
            isCompatible = this.isTypeCompatible(recordType, parentType);
        }
    }
    else if (!isCompatible && !newType.FullBaseType) {
        // In that case the type we are trying to introduce is less precise than the currently assigned one
        var recordTypeDetail = this.findType(recordType);
        if (recordTypeDetail.FullBaseType) {
            isCompatible = this.isTypeCompatible(recordTypeDetail.FullBaseType, newType);
        }
    }
    return isCompatible;
};

exports.storeAnnotationValue = function (entityName, annotationValue, propertyValue, variableMap, currentControlType) {
    var self = this;
    var annotationName = (annotationValue.model !== '') ? annotationValue.model + '>' + annotationValue.path : annotationValue.path;
    var annotationPath = _parseAnnotationName(annotationName, variableMap);
    var term = this.findTerm(annotationPath[0].path || annotationPath[0].repeatType);

    if (term) {
        var type;
        var typeName = term.Type;
        var currentQualifier;
        if (term.isAbstract || term.IsCollection) {
            typeName = annotationPath[0].repeatType || term.CollectionType;
        }
        else {
            currentQualifier = annotationPath[0].idx;
        }
        type = self.findType(typeName);

        if (term.AppliesTo === 'EntitySet') {
            // Promote to nameSet for this annotation
            var entityType = commonBuilder.getEntityByName(entityName);
            if (entityType) {
                entityName = commonBuilder.getProjectId() + '_Entities/' + entityType.nameSet;
            }
            else {
                entityName = commonBuilder.getProjectId() + '_Entities/' + entityName + 'Set';
            }
        }
        // Setup the initial structure for the annotation
        if (annotationStructure[entityName] === undefined) {
            annotationStructure[entityName] = {entityName: entityName};
        }

        var existingStructure = self.getStructureFor(annotationStructure[entityName], type, term, currentQualifier, annotationPath[0].idx);
        type = self.findType(existingStructure.type);

        var slicedPath = annotationPath.slice(1);
        var isResolved = false;
        var wasResolved = false;
        var isComplex = false;
        var newBindingPath;
        var targetEntityName;
        var targetAnnotationPath;
        var previousValue;

        var completePath = '';
        var resolvedTerm = null;
        var targetTerm;
        var prevIdx = annotationPath[0].idx;

        var previousSlicedPathPart = annotationPath[0];
        _.each(slicedPath, function (slicedPathPart) {
            prevIdx = (slicedPathPart.idx !== undefined) ? slicedPathPart.idx : prevIdx;
            path = slicedPathPart.path;
            if (completePath.length) {
                completePath += '_';
            }
            if (prevIdx !== undefined) {
                completePath += prevIdx + '_';
            }
            completePath += path;
            if (path.indexOf('sap:') === 0) {
                // This is a V2 annotation and we should place it as an extension to the property
                if (existingStructure && existingStructure.value && existingStructure.value.bindingPath) {
                    if (!dataModelExtension[entityName][existingStructure.value.bindingPath]) {
                        dataModelExtension[entityName][existingStructure.value.bindingPath] = {};
                    }
                    dataModelExtension[entityName][existingStructure.value.bindingPath][path.substr(4)] = propertyValue;
                }
                else if (targetEntityName && newBindingPath) {
                    if (!dataModelExtension[targetEntityName][newBindingPath]) {
                        dataModelExtension[targetEntityName][newBindingPath] = {};
                    }
                    dataModelExtension[targetEntityName][newBindingPath][path.substr(4)] = propertyValue;
                }
            }
            else {
                if (wasResolved) {
                    // Previous path piece was resolved so we need to find the correct type
                    var termName = path;
                    if (resolvedTerm) {
                        termName = resolvedTerm;
                        resolvedTerm = null;
                    }
                    term = self.findTerm(termName);

                    typeName = term.Type;
                    if (term.isAbstract || term.IsCollection) {
                        typeName = previousSlicedPathPart.repeatType || term.CollectionType;
                    }
                    type = self.findType(typeName);

                    if (term.AppliesTo === 'Property' && !propertyValue) {
                        // we prevent from creating a structure when the Term applies to a Property but there is no value to store.
                        return;
                    }
                    else if (termName === 'Org.OData.Measures.V1.ISOCurrency' && previousValue.type !== 'Decimal' && previousValue.type !== undefined) {
                        // we prevent from creating a Currency annotation when the property is not of type Edm.Decimal
                        return;
                    }
                    existingStructure = self.getStructureFor(existingStructure, type, term, currentQualifier, prevIdx);
                    currentQualifier = undefined;
                }
                // Get the real type that was retrieved here
                type = self.findType(existingStructure.type);
                isResolved = slicedPathPart.resolved || term.AppliesTo === 'Property' || slicedPathPart.path === 'Value';
                isComplex = !existingStructure.isSimple && !existingStructure.isEnum;

                if (isComplex) {
                    // 1 - Check if there is a term associated to it that we can use.
                    var potentialTerm = self.findTerm(path);
                    if (potentialTerm !== null) {
                        // 2a - The property is a term which means it will be added as an annotations on the annotation :P
                        // <Record Type="com.sap.vocabularies.UI.v1.DataFieldWithUrl">
                        //     <Annotation Term="com.sap.vocabularies.UI.v1.Importance" EnumMember="com.sap.vocabularies.UI.v1.ImportanceType/High"/>
                        type = self.findType(potentialTerm.Type);
                        existingStructure = existingStructure.annotations[potentialTerm.FullName] = self.createStructure(type, potentialTerm.FullName, existingStructure.entityName, potentialTerm.IsCollection);
                    }
                    else {
                        // 2b - It might just be that the property doesn't actually exist (yet) on the structure
                        if (type.properties[path] === undefined) {
                            // - If there is nothing like that find a type that can be compatible
                            type = self.findChildTypeWithProperty(type.FullType, path);
                            existingStructure.type = type.FullType;
                            _.each(type.properties, function (typeDefaultValue) {
                                if (existingStructure.properties[typeDefaultValue.Name] === undefined) {
                                    existingStructure.properties[typeDefaultValue.Name] = null;
                                }
                            });
                        }

                        var propertyInfo = type.properties[path];
                        if (propertyInfo.Type.indexOf('Edm') === -1) {
                            var isCollection = type.properties[path].IsCollection;
                            if (isCollection) {
                                typeName = type.properties[path].CollectionType;
                            }
                            else {
                                typeName = type.properties[path].Type;
                            }
                            existingStructure = self.getStructureFor(existingStructure.properties, self.findType(typeName), {
                                Name: path,
                                FullName: path,
                                IsCollection: isCollection
                            }, currentQualifier, prevIdx, existingStructure.entityName);
                        }
                        else if (isResolved) {
                            // If it's resolved then either it already has a binding or it has a string in which case we need to extract the property
                            previousValue = existingStructure.properties[path];
                            targetEntityName = existingStructure.entityName;
                            targetAnnotationPath = null;
                            if (!previousValue || !previousValue.isBinding) {
                                // Create or retrieve the property associated with this annotation
                                newBindingPath = propertyValue.bindingPath;
                                if (!newBindingPath) {
                                    // Create a new property
                                    if (annotationPath[0].idx !== undefined) {
                                        newBindingPath = currentControlType + '_' + annotationPath[0].idx + '_' + completePath;
                                    }
                                    else {
                                        newBindingPath = currentControlType + '_' + completePath;
                                    }
                                    self.createExtraProperty(targetEntityName, newBindingPath);
                                    dataModelExtension[targetEntityName][newBindingPath].label = pathPropertyName;
                                    dataModelExtension[targetEntityName][newBindingPath].value = previousValue || propertyValue;
                                }
                            }
                            else if (previousValue.targetEntityName) {
                                targetEntityName = previousValue.targetEntityName;
                            }

                            // Do some additional handling
                            if (propertyInfo.Type.indexOf('Edm.AnnotationPath') === 0) {
                                if (slicedPathPart.termInfo) {
                                    targetTerm = self.findTerm(slicedPathPart.termInfo);
                                    resolvedTerm = slicedPathPart.termInfo;
                                }
                                else {
                                    // FIXME There is a missing metadata in the smartTemplates
                                    targetTerm = {FullName: 'com.sap.vocabularies.UI.v1.LineItem'};
                                    resolvedTerm = 'com.sap.vocabularies.UI.v1.LineItem';
                                }
                                var actualQualifier;
                                if (!previousValue) {
                                    newBindingPath = '@' + targetTerm.FullName;
                                    actualQualifier = _getNewQualifier(newBindingPath);
                                    if (actualQualifier > 0) {
                                        newBindingPath += '#' + actualQualifier;
                                        currentQualifier = actualQualifier;
                                    }
                                }
                                else if (previousValue.isBinding) {
                                    newBindingPath = previousValue.bindingPath + '/@' + targetTerm.FullName;
                                    actualQualifier = _getNewQualifier(newBindingPath);
                                    if (actualQualifier > 0) {
                                        newBindingPath += '#' + actualQualifier;
                                        currentQualifier = actualQualifier;
                                    }
                                }
                                else {
                                    // We already went through here so just reset the values
                                    targetEntityName = previousValue.fullAnnotationPath;
                                    currentQualifier = previousValue.targetQualifier;
                                    newBindingPath = previousValue.annotationPath;
                                }
                                existingStructure.properties[path] = {
                                    annotationPath: newBindingPath,
                                    fullAnnotationPath: targetEntityName,
                                    targetQualifier: currentQualifier
                                };
                                targetAnnotationPath = targetEntityName;
                            }
                            else {
                                if (!previousValue || !previousValue.isBinding) {
                                    existingStructure.properties[path] = {
                                        isBinding: true,
                                        bindingPath: newBindingPath,
                                        isSimple: true,
                                        type: propertyValue.type
                                    };
                                }
                                newBindingPath = existingStructure.properties[path].bindingPath;
                                targetAnnotationPath = targetEntityName + '/' + newBindingPath;
                            }
                            if (!annotationStructure[targetAnnotationPath]) {
                                annotationStructure[targetAnnotationPath] = {entityName: targetEntityName};
                            }
                            existingStructure = annotationStructure[targetAnnotationPath];
                        }
                        else {
                            if (propertyValue.isBinding && propertyInfo.IsURL) {
                                propertyValue.isNavigationURL = true;
                                propertyValue.navigationInfo = _createNavigationInfo(propertyValue.entityId, propertyValue.bindingProperty);
                            }
                            else if (!propertyValue.isBinding && propertyInfo.Type.indexOf('Edm.AnnotationPath') === 0) {
                                var newEntity = self.createEntity();
                                var newProperty = self.createExtraProperty(entityName, propertyValue, true, newEntity.id, true);
                                propertyValue = {
                                    bindingPath: newProperty,
                                    targetEntityName: newEntity.id,
                                    isBinding: true
                                };
                            }
                            if (propertyValue.type) {
                                // we make sure the type we add in the propertyValue when it is resolev doesn't come in the way
                                delete propertyValue.type;
                            }
                            existingStructure.properties[path] = propertyValue;
                        }
                    }
                }
                else {
                    if (isResolved) {
                        // If it's resolved then either it already has a binding or it has a string in which case we need to extract the property
                        previousValue = existingStructure.value;
                        if (!previousValue || !previousValue.isBinding) {
                            // If we're trying to enhance something on top of an empty propertypath -> stop there
                            if (previousValue || type.FullType.indexOf('Edm.PropertyPath') === -1) {
                                var lastIndexOfDotInPath = path.lastIndexOf('.');
                                var pathPropertyName = path.substr(lastIndexOfDotInPath + 1);
                                newBindingPath = newBindingPath + '_' + pathPropertyName;
                                if (!propertyValue.isBinding) {
                                    if (!dataModelExtension[targetEntityName]) {
                                        dataModelExtension[targetEntityName] = {};
                                    }
                                    dataModelExtension[targetEntityName][newBindingPath] = {
                                        label: pathPropertyName,
                                        value: previousValue || propertyValue
                                    };
                                    propertyValue = {
                                        isBinding: true,
                                        bindingPath: newBindingPath,
                                        isSimple: true
                                    };
                                }
                            }
                            existingStructure.value = propertyValue;
                            existingStructure = annotationStructure[targetEntityName + '/' + newBindingPath];
                        }
                    }
                    else {
                        if (type.FullType.indexOf('Edm.PropertyPath') === 0 && !propertyValue.isBinding && !_.isEmpty(propertyValue)) {
                            // If the thing we are binding is a PropertyPath we need to add a new property to the entity
                            // but only if the propertyValue is not empty
                            // This property should have a label defined based on the original value that was passed
                            propertyValue = {
                                isBinding: true,
                                bindingPath: self.createExtraProperty(entityName, propertyValue)
                            };
                        }
                        existingStructure.value = propertyValue;
                    }
                }
            }
            previousSlicedPathPart = slicedPathPart;
            wasResolved = isResolved;
        });
    }
};
