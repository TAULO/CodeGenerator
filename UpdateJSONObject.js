function updateFlowObject(id, name, code) {
    return {
        "id": id,
        "name": name,
        "descriptive": {
            "id": "",
            "name": "",
            "inputs": [],
            "outputs": [],
            "application": "",
            "code": code,
            "blocklyXml": "",
            "type": "",
            "typeConfig": {
                "subjectPrefix": "",
                "triggers": {
                    "context": [],
                    "external": [{
                        "configuration": {
                            "keys": [""],
                            "modifiers": ["", ""]
                        },
                        "externalType": ""
                    }],
                    "lifecycle": [],
                    "services": []
                }
            },
            "anchors": [],
            "usesfields": [],
            "usesFlows": [],
            "usesTables": [],
            "compatibleVersion": "",
            "hideFromUser": false,
            "precompile": false,
            "restoreFocus": false,
            "isMandatory": false,
            "autocompleteSnippets": false,
            "autocompleteTypes": false,
            "debuggerEnabled": false,
            "hideInFlowLaunchMenu": false,
            "icon": "",
            "version": ""
        }
    }
}

function updateAppObject(id, name) {
    return {
        "id": id,
        "name": name,
        "descriptive": {
            "appVersion": "",
            "executablepathcontains": "",
            "framecontains": "",
            "icon": "",
            "jvmlocation": "",
            "launchwith": "",
            "manufacturer": "",
            "md5": "",
            "openIn": "",
            "processcontains": "",
            "titlebarcontains": "",
            "type": "",
            "urlcontains": "",
            "version": ""
        }
    }
}

function updateFieldObject(id, name) {
    return {
        "id": id,
        "name": name,
        "descriptive": {
            "id": "",
            "name": "",
            "actions": ["", ""],
            "application": "",
            "image": "",
            "offset": {},
            "path": "",
            "variablename": "",
            "version": ""
        }
    }
}

module.exports = { updateAppObject, updateFieldObject, updateFlowObject }
