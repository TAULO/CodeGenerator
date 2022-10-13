const json = require("./data.json")
const fs = require("fs")
const { v4 } = require("uuid")
const { updateFlowObject, updateFieldObject, updateAppObject } = require("./UpdateJSONObject")
const { getJSFilesFromFolder } = require("./GenerateCode")

function generateJSON(appAmount, fieldAmount, flowAmount, jsFiles, toJSONFile) {
    const jsFilesArr = jsFiles
    for (let i = 1; i <= appAmount; i++) {
        const arr = json.batch.application
        arr.push({
            ...arr[i - 1],
            ...updateAppObject(v4(), `App Name ${i}`)
        })
    }

    for (let i = 1; i <= fieldAmount; i++) {
        const arr = json.batch.field
        arr.push({
            ...arr[i - 1],
            ...updateFieldObject(v4(), `Field Name ${i}`)
        })
    }

    for (let i = 1; i <= jsFilesArr.length || i <= flowAmount; i++) {
        const arr = json.batch.flow
        arr.push({
            ...arr[i - 1],
            ...updateFlowObject(v4(), `Flow Name ${i}`, jsFilesArr[i - 1])
        })
    }
    fs.writeFileSync("./GeneratedData/GeneratedJSONdata.json", JSON.stringify(toJSONFile), (err) => err ? console.log(err) : console.log("success"))
}

async function main() {
    generateJSON(5,5,getJSFilesFromFolder().length, getJSFilesFromFolder(), json)
}
// main()