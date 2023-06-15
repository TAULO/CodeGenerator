import rndStr from "../GenerateJSON/RandomData.js";
import {
    v4
} from "uuid";

import getJSFilesFromFolder from "../GetJSFiles.js";

async function getRandomFile() {
    const files = await getJSFilesFromFolder(10000)
    const filesLength = files.length
    const randomIndex = Math.floor((Math.random() * filesLength - 1) + 1)
    return files[randomIndex]
}

function randomApp() {

}

getRandomFile()
async function generateFlows(amount) {
    const flows = []
    for (let i = 0; i < amount; i++) {
        flows.push({
            "id": v4(),
            "name": rndStr(),
            "descriptive": {
                "application": "test",
                "id": v4(),
                "inputs": [rndStr(), rndStr()],
                "outputs": [rndStr(), rndStr()],
                "code": await getRandomFile(),
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
    return {
        "batch": {
            "flow": flows
        }
    }
}

export default generateFlows