import rndStr from "../GenerateJSON/RandomData.js";
import {
    v4
} from "uuid";

import getJSFilesFromFolder from "../GetJSFiles.js";

function getRandomId(idsArr) {
    const randomIndex = Math.floor((Math.random() * idsArr.length - 1) + 1)
    return idsArr[randomIndex]
}

// TODO: check if same js files are being used
async function getRandomFile(index, flowAmount) {
    const files = await getJSFilesFromFolder(flowAmount)

    // random files
    // const filesLength = files.length
    // const randomIndex = Math.floor((Math.random() * filesLength - 1) + 1)
    // console.log("Flow random index: ", randomIndex)
    // return files[randomIndex]

    // new 
    return files[index]
}

async function generateAll(appAmount, flowAmount, fieldAmount) {
    const apps = []
    const flows = []
    const fields = []
    const ids = []

    // apps
    for (let i = 0; i < appAmount; i++) {
        ids.push(v4())
        apps.push({
            "id": ids[i],
            "name": rndStr(),
            "descriptive": {
                "name": rndStr(),
                "appVersion": rndStr(),
                "executablepathcontains": rndStr(),
                "framecontains": rndStr(),
                "icon": rndStr(),
                "jvmlocation": rndStr(),
                "launchwith": rndStr(),
                "manufacturer": rndStr(),
                "md5": rndStr(),
                "openIn": rndStr(),
                "processcontains": rndStr(),
                "titlebarcontains": rndStr(),
                "type": rndStr(),
                "urlcontains": rndStr(),
                "version": rndStr()
            }
        })
    }

    // flows
    for (let i = 0; i < flowAmount; i++) {
        let name = ""
        if (!getRandomId(ids)) {
            name = "NO_APP_" + rndStr()
        } else {
            name = rndStr()
        }
        const rndId = getRandomId(ids) ?? v4()

        flows.push({
            "id": v4(),
            "name": name,
            "descriptive": {
                "application": rndId,
                "id": v4(),
                "inputs": [rndStr(), rndStr()],
                "outputs": [rndStr(), rndStr()],
                "code": await getRandomFile(i, flowAmount),
                "blocklyXml": rndStr(),
                "type": rndStr(),
                "anchors": [rndStr(), rndStr()],
                "usesfields": [rndStr(), rndStr()],
                "usesFlows": [rndStr(), rndStr()],
                "usesTables": [rndStr(), rndStr()],
                "compatibleVersion": rndStr(),
                "hideFromUser": false,
                "precompile": false,
                "restoreFocus": false,
                "isMandatory": false,
                "autocompleteSnippets": false,
                "autocompleteTypes": false,
                "debuggerEnabled": false,
                "hideInFlowLaunchMenu": false,
                "icon": rndStr(),
                "version": rndStr()
            }
        })
    }

    // fields
    for (let i = 0; i < fieldAmount; i++) {
        let name = ""
        if (!getRandomId(ids)) {
            name = "NO_APP_" + rndStr()
        } else {
            name = rndStr()
        }
        const rndId = getRandomId(ids) ??  v4()

        fields.push({
            "id": v4(),
            "name": rndStr(),
            "descriptive": {
                "id": v4(),
                "name": rndStr(),
                "application": rndId,
                "actions": [
                    rndStr(),
                    rndStr()
                ],
                "image": rndStr(),
                "offset": {},
                "path": rndStr(),
                "variablename": rndStr(),
                "version": rndStr()
            }
        })
    }
    // console.log("apps", apps)
    // console.log("flows", flows.length)
    // console.log("fields", fields)

    console.log("____________________________________________________________________________________")
    return {
        "batch": {
            "application": apps,
            "flow": flows,
            "field": fields
        }
    }
}

export default generateAll