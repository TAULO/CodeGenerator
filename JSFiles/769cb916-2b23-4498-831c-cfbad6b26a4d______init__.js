/*! \file
*   \brief 基础仿函、参数注册与创建.
*   \author 谭立方
*   \date 2011-2014
*   \version 1.0
*   \copyright 2011-2014PERA Global
*/

log(qsTranslate("AutoScript", "Import ") + __extension__ + qsTranslate("AutoScript", " plugin..."));
__setupPackage__("rom.autocommon");

function createSimFunction(model, parentSf) {
    var sf = new rom.SimFunction(model.properties.id, parentSf);
    rom.$.setSimfunProperties(sf, model.properties);
    return sf;
}

function createAssemblysf(model, parentSf) {
    var sf = new rom.Assembly(model.properties.id, parentSf);
    rom.$.setSimfunProperties(sf, model.properties);
    return sf;
}

function createSwitch(model, parentSf) {
    var sf = new rom.Switch(model.properties.id, parentSf);
    rom.$.setSimfunProperties(sf, model.properties);
    sf.exclusive = model.properties.exclusive;
    sf.defaultSwitch = model.properties.defaultSwitch;
    return sf;
}

function createLoop(model, parentSf) {
    var sf = new rom.Loop(model.properties.id, parentSf);
    rom.$.setSimfunProperties(sf, model.properties);
    sf.loopType = model.properties.loopType;
    return sf;
}

function createBus(model, parentSf) {
    var sf = new rom.Bus(model.properties.id, parentSf);
    rom.$.setSimfunProperties(sf, model.properties);
    sf.firstRunIndex = model.properties.firstRunIndex;
    sf.nextRuns = model.properties.nextRuns;
    sf.priorities = model.properties.priorities;
    sf.runConditionsCode = model.properties.conditions;
    sf.stopConditionCode = model.properties.stopCondition;
    return sf;
}

function createParallel(model, parentSf) {
    var sf = new rom.Parallel(model.properties.id, parentSf);
    rom.$.setSimfunProperties(sf, model.properties);
    return sf;
}

function createSequence(model, parentSf) {
    var sf = new rom.Sequence(model.properties.id, parentSf);
    rom.$.setSimfunProperties(sf, model.properties);
    return sf;
}

function createAutomationScript(model, parentSf) {
    var sf = new rom.AutomationScript(model.properties.id, parentSf);
    rom.$.setSimfunProperties(sf, model.properties);
    sf.scriptCode = model.properties.script;
    return sf;
}

function createSimApp(model, parentSf) {
    var sf = new rom.SimApp(model.properties.id, parentSf);
    rom.$.setSimfunProperties(sf, model.properties);
    sf.appPath = model.properties.appPath;
    sf.args = model.properties.args;
    sf.appIOFiles = model.properties.appIOFiles;
    sf.templateLocalFilePairs = model.properties.filePairs;
    return sf;
}

function createModelDataExtract(model, parentSf) {
    var sf = new rom.ModelDataExtract(model.properties.id, parentSf);
    rom.$.setSimfunProperties(sf, model.properties);
    sf.romFile = model.properties.romFile;
    sf.modelId = model.properties.modelId;
    sf.resultId = model.properties.resultId;
    sf.extractCode = model.properties.extractCode;
    return sf;
}

function createDatabase(model, parentSf) {
    var sf = new rom.Database(model.properties.id, parentSf);
    rom.$.setSimfunProperties(sf, model.properties);
    sf.interactCode = model.properties.interactCode;
    sf.databaseName = model.properties.databaseName;
    sf.userName = model.properties.userName;
    sf.password = model.properties.password;
    sf.hostName = model.properties.hostName;
    sf.driverName = model.properties.driverName;
    sf.port = model.properties.port;
    sf.connectionName = model.properties.connectionName;
    return sf;
}

//function createTimer(model, parentSf) {
//    var sf = new rom.Timer(model.properties.id, parentSf);
//    rom.$.setSimfunProperties(sf, model.properties);
//    return sf;
//}

function createIntegerParameter(name, parameter, sfOrGroup, parObj) {
    if (!parObj)
        parObj = new rom.IntegerParameter(name, parameter['type'], sfOrGroup);
    if ('value' in parameter) {
        parObj.value = parameter['value'];
    } else {
        parObj.value = 0;
    }
    rom.$.setModelElementProperties(parObj, parameter);

    if ('properties' in parameter) {
        rom.$.setNumericProperties(parameter, parObj);
    }
    rom.$.setEnumProperties(parameter, parObj);
    rom.$.setNumberCustomFormat(parameter, parObj);

    return parObj;
}

// todo 参数在cpp中创建的情况
function createIntegerArrayParameter(name, parameter, sfOrGroup, parObj) {
    var dims = [];
    if ('dimensions' in parameter)
        dims = parameter['dimensions'];
    var iv = new rom.IntegerArrayParameter(name, parameter['type'], dims, sfOrGroup);
    iv.fixed = parameter['fixed'];
    if ('value' in parameter) // linked parameter has no value
        iv.array = parameter['value'];
    rom.$.setModelElementProperties(iv, parameter);

    if ('properties' in parameter) {
        rom.$.setNumericProperties(parameter, iv);
    }
    return iv;
}

function createDoubleParameter(name, parameter, sfOrGroup, parObj) {
    if (!parObj)
        parObj = new rom.DoubleParameter(name, parameter['type'], sfOrGroup);
    if ('value' in parameter) {
        parObj.value = parameter['value'];
    } else {
        parObj.value = 0;
    }
    rom.$.setModelElementProperties(parObj, parameter);

    if ('properties' in parameter) {
        rom.$.setNumericProperties(parameter, parObj);
    }
    rom.$.setEnumProperties(parameter, parObj);
    rom.$.setNumberCustomFormat(parameter, parObj);

    return parObj;
}

// todo
// todo 参数在cpp中创建的情况
function createDoubleArrayParameter(name, parameter, sfOrGroup, parObj) {
    var dims = [];
    if ('dimensions' in parameter)
        dims = parameter['dimensions'];
    var dv = new rom.DoubleArrayParameter(name, parameter['type'], dims, sfOrGroup);
    dv.fixed = parameter['fixed'];
    if ('value' in parameter) // linked parameter has no value
        dv.array = parameter['value'];
    rom.$.setModelElementProperties(dv, parameter);

    if ('properties' in parameter) {
        rom.$.setNumericProperties(parameter, dv);
    }
    return dv;
}

function createBooleanParameter(name, parameter, sfOrGroup, parObj) {
    if (!parObj)
        parObj = new rom.BooleanParameter(name, parameter['type'], sfOrGroup);
    parObj.value = parameter['value'];
    rom.$.setModelElementProperties(parObj, parameter);
    return parObj;
}

// todo
// todo 参数在cpp中创建的情况
function createBooleanArrayParameter(name, parameter, sfOrGroup, parObj) {
    var dims = [];
    if ('dimensions' in parameter)
        dims = parameter['dimensions'];
    var dv = new rom.BooleanArrayParameter(name, parameter['type'], dims, sfOrGroup);
    dv.fixed = parameter['fixed'];
    if ('value' in parameter) // linked parameter has no value
        dv.array = parameter['value'];
    rom.$.setModelElementProperties(dv, parameter);

    //    if ('properties' in parameter) {
    //        setNumericProperties(parameter, dv);
    //    }
    return dv;
}

function createStringParameter(name, parameter, sfOrGroup, parObj) {
    if (!parObj)
        parObj = new rom.StringParameter(name, parameter['type'], sfOrGroup);
    parObj.value = parameter['value'];
    rom.$.setModelElementProperties(parObj, parameter);
    rom.$.setEnumProperties(parameter, parObj);
    return parObj;
}

function createCompositeParameter(name, parameter, sfOrGroup, parObj) {
    if (!parObj)
        parObj = new rom.CompositeParameter(name, parameter['type'], sfOrGroup);
    //parObj.value
    rom.$.setModelElementProperties(parObj, parameter);
    return parObj;
}

function createFileParameter(name, parameter, sfOrGroup, parObj) {
    if (!parObj)
        parObj = new rom.FileParameter(name, parameter['type'], sfOrGroup);
    if ('children' in parameter) {
        var parameters = parameter.children;
        var parObj2 = null;
        for (var par in parameters) {
            var childPar = parameters[par];
            parObj2 = null;
            if (parObj.containParameter(par)) {
                parObj2 = parObj.parameterByName(par);
            }
            rom.$.parseParameter(par, childPar, parObj, parObj2);
        }
    }

    parObj.fileName = parameter['fileName'];
    parObj.isText = parameter['isText'];
    //    parObj.isEmbedded = parameter['isEmbedded'];
    parObj.comment = parameter['comment'];
    parObj.isTemplate = parameter['isTemplate'];
    parObj.localFileName = parameter['localFileName'];
    parObj.externalOpenCode = parameter['externalOpenCode'];
    rom.$.setModelElementProperties(parObj, parameter);
    return parObj;
}

function createXlsxFileParameter(name, parameter, sfOrGroup, parObj) {
    if (!parObj)
        parObj = new rom.XlsxFileParameter(name, parameter['type'], sfOrGroup);
    if ('children' in parameter) {
        var parameters = parameter.children;
        var parObj2 = null;
        for (var par in parameters) {
            var childPar = parameters[par];
            parObj2 = null;
            if (parObj.containParameter(par)) {
                parObj2 = parObj.parameterByName(par);
            }
            rom.$.parseParameter(par, childPar, parObj, parObj2);
        }
    }

    parObj.fileName = parameter['fileName'];
    parObj.isText = parameter['isText'];
    //    parObj.isEmbedded = parameter['isEmbedded'];
    parObj.comment = parameter['comment'];
    parObj.isTemplate = parameter['isTemplate'];
    parObj.localFileName = parameter['localFileName'];
    parObj.externalOpenCode = parameter['externalOpenCode'];
    rom.$.setModelElementProperties(parObj, parameter);
    return parObj;
}

// todo
// todo 参数在cpp中创建的情况
function createStringArrayParameter(name, parameter, sfOrGroup, parObj) {
    var dims = [];
    if ('dimensions' in parameter)
        dims = parameter['dimensions'];
    var dv = new rom.StringArrayParameter(name, parameter['type'], dims, sfOrGroup);
    dv.fixed = parameter['fixed'];
    if ('value' in parameter) // linked parameter has no value
        dv.array = parameter['value'];
    rom.$.setModelElementProperties(dv, parameter);

    //    if ('properties' in parameter) {
    //        setNumericProperties(parameter, dv);
    //    }
    return dv;
}

function createTableParameter(name, parameter, sfOrGroup, parObj) {
    if (!parObj)
        parObj = new rom.TableParameter(name, parameter['type'], sfOrGroup);
    if (parameter.columns) {
        for (var i = 0, sz = parameter.columns.length; i < sz; ++i) {
            var column = parameter.columns[i];
            parObj.appendColumn(column.type, column.size);
            parObj.fillColumnAt(i, column.value);
            parObj.setColumnNameAt(i, column.name);
            parObj.setColumnLongNameAt(i, column.longName);
            parObj.setColumnUnitAt(i, column.unit);
            parObj.setColumnCommentAt(i, column.comment);
            parObj.setColumnExpressionAt(i, column.expression);
            parObj.setColumnSignificanceAt(i, column.significance);
        }
    }

    return parObj;
}

function createGroupParameter(name, groupParameter, sfOrGroup, parObj) {
    if (!parObj)
        parObj = new rom.GroupParameter(name, sfOrGroup);
    if ('children' in groupParameter) {
        var parameters = groupParameter.children;
        var parObj2 = null;
        for (var par in parameters) {
            var parameter = parameters[par];
            parObj2 = null;
            if (parObj.containParameter(par)) {
                parObj2 = parObj.parameterByName(par);
            }
            rom.$.parseParameter(par, parameter, parObj, parObj2);
        }
    }
    rom.$.setModelElementProperties(parObj, groupParameter);
    return parObj;
}

function createReferenceParameter(name, parameter, sfOrGroup, parObj) {
    var value = '';
    if ('value' in parameter) {
        value = parameter.value;
    } else {
        parameter.referenced = false;
    }

    var isInput = (parameter.type === rom.RefInput);
    if (!parObj) {
        parObj = new rom.ReferenceParameter(name, value, parameter.referenced, isInput, sfOrGroup);
    } else {
        parObj.setValue(value, parameter.referenced);
    }
    rom.$.setModelElementProperties(parObj, parameter);
    return parObj;
}

// todo 参数在cpp中创建的情况
function createReferenceArrayParameter(name, parameter, sfOrGroup, parObj) {
    var isInput = (parameter.type === rom.RefInput);
    var rav = new rom.ReferenceArrayParameter(name, isInput, sfOrGroup);
    if ('elems' in parameter) {
        var elemArr = parameter.elems;
        for (var i = 0; i < elemArr.length; ++i) {
            rav.appendReferenceParameter(elemArr[i]['value'], elemArr[i]['referenced']);
        }
    }
    rom.$.setModelElementProperties(rav, parameter);
    return rav;
}

function registerParameters() {
    // the register key is class name.
    if ('GroupParameter' in rom.library.parameters)
        throw new Error(qsTranslate('AutoScript', 'GroupParameter has been in existence.'));

    rom.library.parameters['GroupParameter'] = {
        name : qsTranslate('AutoScript', 'Group'),
        factory : createGroupParameter,
        icon : 'group.svg',
        extension : __extension__,
        group : qsTranslate('AutoScript', 'Base Single Value Parameter'),
        author : qsTranslate('AutoScript', 'peraglobal'),
        description : qsTranslate('AutoScript', 'Group Parameter')
    };

    if ('IntegerParameter' in rom.library.parameters)
        throw new Error(qsTranslate('AutoScript', 'IntegerParameter has been in existence.'));
    rom.library.parameters['IntegerParameter'] = {
        name : qsTranslate('AutoScript', 'Integer'),
        factory : createIntegerParameter,
        group : qsTranslate('AutoScript', 'Base Single Value Parameter'),
        numeric : true,
        icon : 'integer.svg',
        extension : __extension__,
//        plugin : 'AutoCommonParameterEditor',
        //tools : [{menuItem : '编辑器...', actor : 'IntegerEditor'}],
        author : qsTranslate('AutoScript', 'peraglobal'),
        description : qsTranslate('AutoScript', 'Integer Parameter')
    };

    if ('DoubleParameter' in rom.library.parameters)
        throw new Error(qsTranslate('AutoScript', 'DoubleParameter has been in existence.'));

    rom.library.parameters['DoubleParameter'] = {
        name : qsTranslate('AutoScript', 'Double'),
        factory : createDoubleParameter,
        group : qsTranslate('AutoScript', 'Base Single Value Parameter'),
        numeric : true,
        icon : 'double.svg',
        extension : __extension__,
//        plugin : 'AutoCommonParameterEditor',
        author : qsTranslate('AutoScript', 'peraglobal'),
        description : qsTranslate('AutoScript', 'Double Parameter')
    };

    if ('BooleanParameter' in rom.library.parameters)
        throw new Error(qsTranslate('AutoScript', 'BooleanParameter has been in existence.'));

    rom.library.parameters['BooleanParameter'] = {
        name : qsTranslate('AutoScript', 'Boolean'),
        factory : createBooleanParameter,
        icon : 'bool.svg',
        extension : __extension__,
        group : qsTranslate('AutoScript', 'Base Single Value Parameter'),
//        plugin : 'AutoCommonParameterEditor',
        author : qsTranslate('AutoScript', 'peraglobal'),
        description : qsTranslate('AutoScript', 'Boolean Parameter')
    };

    if ('StringParameter' in rom.library.parameters)
        throw new Error(qsTranslate('AutoScript', 'StringParameter has been in existence.'));

    rom.library.parameters['StringParameter'] = {
        name : qsTranslate('AutoScript', 'String'),
        factory : createStringParameter,
        icon : 'string.svg',
        extension : __extension__,
        group : qsTranslate('AutoScript', 'Base Single Value Parameter'),
//        plugin : 'AutoCommonParameterEditor',
        author : qsTranslate('AutoScript', 'peraglobal'),
        description : qsTranslate('AutoScript', 'String Parameter')
    };

    if ('FileParameter' in rom.library.parameters)
        throw new Error(qsTranslate('AutoScript', 'FileParameter has been in existence.'));

    rom.library.parameters['FileParameter'] = {
        name : qsTranslate('AutoScript', 'File'),
        factory : createFileParameter,
        icon : 'file.svg',
        extension : __extension__,
        group : qsTranslate('AutoScript', 'Base Single Value Parameter'),
        plugin : 'AutoCommonGUI',
        tools : [{ menuItem : qsTranslate('AutoScript', 'Select File...'), actor : 'SelectFile' },
            { menuItem : qsTranslate('AutoScript', 'Create or Update Parameters from the Text File'), actor : 'UpdateParameters' },
            { menuItem : qsTranslate('AutoScript', 'External Open File'), actor : 'ExternalOpenFile' }
            //{ menuItem : qsTranslate('AutoScript', 'Remove Input Template File'), actor : 'RemoveTemplateFile' },
            //{ menuItem : 'Remove File'), actor : 'RemoveFile' },
            //{ menuItem : 'Download File...'), actor : 'DownloadFile' }
        ],
        editor : 'FileEditor',
        author : qsTranslate('AutoScript', 'peraglobal'),
        description : qsTranslate('AutoScript', 'File Parameter')
    };

    if ('XlsxFileParameter' in rom.library.parameters)
        throw new Error(qsTranslate('AutoScript', 'XlsxFileParameter has been in existence.'));

    rom.library.parameters['XlsxFileParameter'] = {
        name : qsTranslate('AutoScript', 'XlsxFile'),
        factory : createXlsxFileParameter,
        icon : 'xlsxfile.svg',
        extension : __extension__,
        group : qsTranslate('AutoScript', 'Base Single Value Parameter'),
        plugin : 'AutoCommonGUI',
        tools : [{ menuItem : qsTranslate('AutoScript', 'Select File...'), actor : 'SelectFile' },
            { menuItem : qsTranslate('AutoScript', 'External Open File'), actor : 'ExternalOpenFile' }
            //{ menuItem : qsTranslate('AutoScript', 'Remove Input Template File'), actor : 'RemoveTemplateFile' },
            //{ menuItem : 'Remove File'), actor : 'RemoveFile' },
            //{ menuItem : 'Download File...'), actor : 'DownloadFile' }
        ],
        editor : 'XlsxFileEditor',
        author : qsTranslate('AutoScript', 'peraglobal'),
        description : qsTranslate('AutoScript', 'Xlsx File Parameter')
    };

    if ('ReferenceParameter' in rom.library.parameters)
        throw new Error(qsTranslate('AutoScript', 'ReferenceParameter has been in existence.'));

    rom.library.parameters['ReferenceParameter'] = {
        name : qsTranslate('AutoScript', 'Reference'),
        factory : createReferenceParameter,
        icon : 'ref.svg',
        manualCreate : false,
        extension : __extension__,
        group : qsTranslate('AutoScript', 'Base Single Value Parameter'),
        author : qsTranslate('AutoScript', 'peraglobal'),
        description : qsTranslate('AutoScript', 'Reference Parameter')
    };

    if ('IntegerArrayParameter' in rom.library.parameters)
        throw new Error(qsTranslate('AutoScript', 'IntegerArrayParameter has been in existence.'));

    rom.library.parameters['IntegerArrayParameter'] = {
        name : qsTranslate('AutoScript', 'Integer[]'),
        factory : createIntegerArrayParameter,
        icon : 'integerarr.svg',
        extension : __extension__,
        editor : 'IntegerArrayEditor',
        group : qsTranslate('AutoScript', 'Base Multivalued Parameter'),
        plugin : 'AutoCommonGUI',
        numeric : true,
        author : qsTranslate('AutoScript', 'peraglobal'),
        description : qsTranslate('AutoScript', 'Integer Array Parameter')
    };

    if ('DoubleArrayParameter' in rom.library.parameters)
        throw new Error(qsTranslate('AutoScript', 'DoubleArrayParameter has been in existence.'));

    rom.library.parameters['DoubleArrayParameter'] = {
        name : qsTranslate('AutoScript', 'Double[]'),
        factory : createDoubleArrayParameter,
        icon : 'doublearr.svg',
        extension : __extension__,
        editor : 'DoubleArrayEditor',
        group : qsTranslate('AutoScript', 'Base Multivalued Parameter'),
        plugin : 'AutoCommonGUI',
        numeric : true,
        author : qsTranslate('AutoScript', 'peraglobal'),
        description : qsTranslate('AutoScript', 'Double Array Parameter')
    };

    if ('BooleanArrayParameter' in rom.library.parameters)
        throw new Error(qsTranslate('AutoScript', 'BooleanArrayParameter has been in existence.'));

    rom.library.parameters['BooleanArrayParameter'] = {
        name : qsTranslate('AutoScript', 'Boolean[]'),
        factory : createBooleanArrayParameter,
        icon : 'boolarr.svg',
        extension : __extension__,
        editor : 'BooleanArrayEditor',
        group : qsTranslate('AutoScript', 'Base Multivalued Parameter'),
        plugin : 'AutoCommonGUI',
        author : qsTranslate('AutoScript', 'peraglobal'),
        description : qsTranslate('AutoScript', 'Boolean Array Parameter')
    };

    if ('StringArrayParameter' in rom.library.parameters)
        throw new Error(qsTranslate('AutoScript', 'StringArrayParameter has been in existence.'));

    rom.library.parameters['StringArrayParameter'] = {
        name : qsTranslate('AutoScript', 'String[]'),
        factory : createStringArrayParameter,
        icon : 'stringarr.svg',
        extension : __extension__,
        editor : 'StringArrayEditor',
        group : qsTranslate('AutoScript', 'Base Multivalued Parameter'),
        plugin : 'AutoCommonGUI',
        author : qsTranslate('AutoScript', 'peraglobal'),
        description : qsTranslate('AutoScript', 'String Array Parameter')
    };

    if ('TableParameter' in rom.library.parameters)
        throw new Error(qsTranslate('AutoScript', 'TableParameter has been in existence.'));

    rom.library.parameters['TableParameter'] = {
        name : qsTranslate('AutoScript', 'Table'),
        factory : createTableParameter,
        icon : 'table.svg',
        extension : __extension__,
        editor : 'TableEditor',
        plugin : 'AutoCommonGUI',
        tools : [{menuItem : qsTranslate('AutoScript', 'Data Visualization...'), actor : 'startSimViz'}],
        group : qsTranslate('AutoScript', 'Base Multivalued Parameter'),
        plugin : 'AutoCommonGUI',
        author : qsTranslate('AutoScript', 'peraglobal'),
        description : qsTranslate('AutoScript', 'Table Parameter')
    };

    if ('CompositeParameter' in rom.library.parameters)
        throw new Error(qsTranslate('AutoScript', 'CompositeParameter has been in existence.'));

    rom.library.parameters['CompositeParameter'] = {
        name : qsTranslate('AutoScript', 'Composite'),
        factory : createCompositeParameter,
        icon : 'group.svg',
        extension : __extension__,
        group : qsTranslate('AutoScript', 'Base Multivalued Parameter'),
        author : qsTranslate('AutoScript', 'peraglobal'),
        description : qsTranslate('AutoScript', 'Composite Parameter')
    };

    if ('ReferenceArrayParameter' in rom.library.parameters)
        throw new Error(qsTranslate('AutoScript', 'ReferenceArrayParameter has been in existence.'));

    rom.library.parameters['ReferenceArrayParameter'] = {
        name : qsTranslate('AutoScript', 'Reference[]'),
        factory : createReferenceArrayParameter,
        icon : 'refarr.svg',
        extension : __extension__,
        manualCreate : false,
        group : qsTranslate('AutoScript', 'Base Multivalued Parameter'),
        author : qsTranslate('AutoScript', 'peraglobal'),
        description : qsTranslate('AutoScript', 'Reference Array Parameter')
    };
}

function registerSimfuns() {
    // the register key is class name.
    if ('Assembly' in rom.library.simfuns)
        throw new Error(qsTranslate('AutoScript', 'Assembly has been in existence.'));

    rom.library.simfuns['Assembly'] = {
        name : qsTranslate('AutoScript', 'Assembly'),
        extension : __extension__,
        factory : createAssemblysf,
        composite : true,
        graphicsItem : 'SequenceItem',
        icon : 'assembly.svg',
        group : qsTranslate('AutoScript', 'Base Driver SimFunction'),
        author : qsTranslate('AutoScript', 'peraglobal'),
        description : qsTranslate('AutoScript', 'Assembly SimFunction represents a model.'),
        os : ['windows', 'linux']
    };

    if ('SimFunction' in rom.library.simfuns)
        throw new Error(qsTranslate('AutoScript', 'SimFunction has been in existence.'));

    rom.library.simfuns['SimFunction'] = {
        name : qsTranslate('AutoScript', 'SimFunction'),
        extension : __extension__,
        factory : createSimFunction,
        composite : false,
        graphicsItem : 'Item',
        //parents : ['Sequence', 'Loop'], // fot test
        icon : 'simfun.svg',
        group : qsTranslate('AutoScript', 'Base SimFunction'),
        author : qsTranslate('AutoScript', 'peraglobal'),
        description : qsTranslate('AutoScript', 'SimFunction represents a placeholder.'),
        os : ['windows', 'linux']
    };

    if ('Sequence' in rom.library.simfuns)
        throw new Error(qsTranslate('AutoScript', 'Sequence has been in existence.'));

    rom.library.simfuns['Sequence'] = {
        name : qsTranslate('AutoScript', 'Sequence'),
        extension : __extension__,
        factory : createSequence,
        composite : true,
        graphicsItem : 'SequenceItem',
        icon : 'sequence.svg',
        group : qsTranslate('AutoScript', 'Base Driver SimFunction'),
        author : qsTranslate('AutoScript', 'peraglobal'),
        description : qsTranslate('AutoScript',
                                  'Sequence can contain children SimFunctions, executed one by one.'),
        os : ['windows', 'linux']
    };

    if ('Switch' in rom.library.simfuns)
        throw new Error(qsTranslate('AutoScript', 'Switch has been in existence.'));

    rom.library.simfuns['Switch'] = {
        name : qsTranslate('AutoScript', 'Switch'),
        extension : __extension__,
        factory : createSwitch,
        composite : true,
        graphicsItem : 'SwitchItem',
        icon : 'switch.svg',
        group : qsTranslate('AutoScript', 'Base Driver SimFunction'),
        author : qsTranslate('AutoScript', 'peraglobal'),
        description : qsTranslate('AutoScript',
                                  'Switch SimFunction executed its SimFunction by condition.'),
        os : ['windows', 'linux']
    };

    if ('Parallel' in rom.library.simfuns)
        throw new Error(qsTranslate('AutoScript', 'Parallel has been in existence.'));

    rom.library.simfuns['Parallel'] = {
        name : qsTranslate('AutoScript', 'Parallel'),
        extension : __extension__,
        factory : createParallel,
        composite : true,
        graphicsItem : 'ParallelItem',
        icon : 'parallel.svg',
        group : qsTranslate('AutoScript', 'Base Driver SimFunction'),
        author : qsTranslate('AutoScript', 'peraglobal'),
        description : qsTranslate('AutoScript',
                                  'Parallel SimFunction executed its SimFunctions concurrently.'),
        os : ['windows', 'linux']
    };

    if ('Bus' in rom.library.simfuns)
        throw new Error(qsTranslate('AutoScript', 'Bus has been in existence.'));

    rom.library.simfuns['Bus'] = {
        name : qsTranslate('AutoScript', 'Bus'),
        extension : __extension__,
        factory : createBus,
        composite : true,
        graphicsItem : 'BusItem',
        icon : 'bus.svg',
        group : qsTranslate('AutoScript', 'Base Driver SimFunction'),
        author : qsTranslate('AutoScript', 'peraglobal'),
        description : qsTranslate('AutoScript', 'The Bus SimFunction is used to execute simfuns by rules.'),
        os : ['windows', 'linux']
    };

    if ('Loop' in rom.library.simfuns)
        throw new Error(qsTranslate('AutoScript', 'Loop has been in existence.'));

    rom.library.simfuns['Loop'] = {
        name : qsTranslate('AutoScript', 'Loop'),
        extension : __extension__,
        factory : createLoop,
        composite : true,
        plugin : 'AutoCommonGUI',
        tools : [ /*{ menuItem : qsTranslate('AutoScript', 'Loop Editor...'), actor : 'LoopEditor', defaultActor : true, //modedialog默认为true
                    statusTip : qsTranslate('AutoScript', "Open a dialog to edit SimFunction's properties") },*/
            //                 { menuItem : qsTranslate('AutoScript', 'Diagram...'), actor : 'LoopPlotters', modedialog : false,
            //                    icon : 'plotter.png', statusTip : qsTranslate('AutoScript', "Open a dialog to edit diagram's properties") },
            //                 { menuItem : 'seperator' },
//            { menuItem : qsTranslate('AutoScript', 'History Data Browsing'), icon : 'history.png', actor : 'IterDataBrowsing', constraint : 1},
//            { menuItem : qsTranslate('AutoScript', 'Realtime Data Browsing'), icon : 'realtime.png', actor : 'RealtimeDataBrowsing', constraint : 2}
            //                 { menuItem : qsTranslate('AutoScript', 'Numerical Parameter Data Extraction...'), actor : 'NumberExporter', modedialog : true }],
        ],

        tabpages : [
            { menuItem : qsTranslate('AutoScript', 'History Data Browsing'), icon : 'history.png', actor : 'IterDataBrowsing', constraint : 1},
            { menuItem : qsTranslate('AutoScript', 'Realtime Data Browsing'), icon : 'realtime.png', actor : 'RealtimeDataBrowsing', constraint : 2}
        ],

        graphicsItem : 'LoopItem',
        icon : 'loop.svg',
        group : qsTranslate('AutoScript', 'Base Driver SimFunction'),
        author : qsTranslate('AutoScript', 'peraglobal'),
        description : qsTranslate('AutoScript', 'The Loop SimFunction is used to execute simfuns iterative.'),
        os : ['windows', 'linux']
    };

    if ('AutomationScript' in rom.library.simfuns)
        throw new Error(qsTranslate('AutoScript', 'AutomationScript has been in existence.'));

    rom.library.simfuns['AutomationScript'] = {
        name : qsTranslate('AutoScript', 'AutomationScript'),
        extension : __extension__,
        factory : createAutomationScript,
        composite : false,
        graphicsItem : 'Item',
        icon : 'autoscript.svg',
        group : qsTranslate('AutoScript', 'Base SimFunction'),
        author : qsTranslate('AutoScript', 'peraglobal'),
        description : qsTranslate('AutoScript', 'The AutomationScript SimFunction is used to execute Automation JavaScript code.'),
        os : ['windows', 'linux']
    };

    if ('SimApp' in rom.library.simfuns)
        throw new Error(qsTranslate('AutoScript', 'SimApp has been in existence.'));

    rom.library.simfuns['SimApp'] = {
        name : qsTranslate('AutoScript', 'SimApp'),
        extension : __extension__,
        factory : createSimApp,
        composite : false,
        graphicsItem : 'Item',
        icon : 'simapp.svg',
        group : qsTranslate('AutoScript', 'Base SimFunction'),
        author : qsTranslate('AutoScript', 'peraglobal'),
        description : qsTranslate('AutoScript', 'The SimApp sf is used to integrate a simulation application.'),
        os : ['windows', 'linux']
    };

    if ('ModelDataExtract' in rom.library.simfuns)
        throw new Error(qsTranslate('AutoScript', 'ModelDataExtract has been in existence.'));

    rom.library.simfuns['ModelDataExtract'] = {
        name : qsTranslate('AutoScript', 'ModelDataExtract'),
        extension : __extension__,
        factory : createModelDataExtract,
        composite : false,
//        plugin : 'AutoCommonGUI',
//        tools : [{menuItem : qsTranslate('AutoScript', 'Model Data Extract Editor...'), actor : 'ScriptEditor'}],
        graphicsItem : 'Item',
        icon : 'modeldataextract.svg',
        group : qsTranslate('AutoScript', 'Base SimFunction'),
        author : qsTranslate('AutoScript', 'peraglobal'),
        description : qsTranslate('AutoScript', 'The ModelDataExtract SimFunction is used to extract data from rom file.'),
        os : ['windows', 'linux']
    };

    if ('Database' in rom.library.simfuns)
        throw new Error(qsTranslate('AutoScript', 'Database has been in existence.'));

    rom.library.simfuns['Database'] = {
        name : qsTranslate('AutoScript', 'Database'),
        extension : __extension__,
        factory : createDatabase,
        composite : false,
        //tools : [{menuItem : qsTranslate('AutoScript', 'Model Data Extract Editor...'), actor : 'ScriptEditor'}],
        graphicsItem : 'Item',
        icon : 'database.svg',
        group : qsTranslate('AutoScript', 'Base SimFunction'),
        author : qsTranslate('AutoScript', 'peraglobal'),
        description : qsTranslate('AutoScript', 'The Database SimFunction is used to exchange data with database.'),
        os : ['windows', 'linux']
    };

    //    if ('Timer' in rom.library.simfuns)
    //        throw new Error(qsTranslate('AutoScript', 'Timer has been in existence.'));

    //    rom.library.simfuns['Timer'] = {
    //        name : qsTranslate('AutoScript', 'Timer'),
    //        extension : __extension__,
    //        factory : createTimer,
    //        composite : true,
    //        graphicsItem : 'SequenceItem',
    //        icon : 'timer.svg',
    //        group : qsTranslate('AutoScript', 'Base Driver SimFunction'),
    //        author : qsTranslate('AutoScript', 'peraglobal'),
    //        description : qsTranslate('AutoScript',
    //                                  'Timer can contain children SimFunctions, provides repetitive running.'),
    //        os : ['windows', 'linux']
    //    };
}

__postInit__ = function() {
    log(qsTranslate('AutoScript', 'Base SimFunctions and Parameters is Imported'));
    log(qsTranslate('AutoScript', 'Register Base SimFunctions'));
    registerSimfuns();
    log(qsTranslate('AutoScript', 'Register Base Parameters'));
    registerParameters();

    rom.Database.openDatabase = function() {
        if (this.driverName === '' && this.connectionName === '')
            return false;

        var db = sql.addDatabase(this.driverName, this.connectionName);
        db.databaseName = this.databaseName;
        if (this.driverName !== 'QSQLITE') {
            db.hostName = this.hostName;
            db.userName = this.userName;
            db.password = this.password;
            db.port = this.port;
        }
        if (!db.open()) {
            log('open db failed.');
            return false;
        }
        this.openedDatabase = db;
        return true;
    };

    rom.Database.closeDatabase = function() {
        if (this.openedDatabase)  {
            this.openedDatabase.close();
            sql.removeDatabase(this.openedDatabase.connectionName);
            delete this.openedDatabase;
        }
    };
}
