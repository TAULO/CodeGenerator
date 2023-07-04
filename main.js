import generateJSON from "./GenerateJSON/GenerateJSON.js"

import json from "./GenerateJSON/data.json" assert { type: "json" }
import getJSFilesFromFolder from "./GetJSFiles.js"


function main() {
    generateJSON(5, 5, 5, getJSFilesFromFolder(), json)
}
// main()