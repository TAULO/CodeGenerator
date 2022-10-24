const { generateJSON }  = require("./GenerateJSON/GenerateJSON.js")
const { generateCode } = require("./GenerateCode/GenerateCode")

const json = require("./GenerateJSON/data.json")
const { getJSFilesFromFolder } = require("./GetJSFiles")


function main() {
    generateJSON(1, 1, 1, getJSFilesFromFolder(), json)
}
main()