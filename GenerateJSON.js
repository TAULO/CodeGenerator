const json = require("./data.json")
const fs = require("fs")
const { v4 } = require("uuid")
const { updateFlowObject, updateFieldObject, updateAppObject, updateTableObject } = require("./UpdateJSONObject")
const { getJSFilesFromFolder } = require("./GenerateCode")

function generateJSON(appAmount, fieldAmount, tableAmount, flowAmount, jsFiles, toJSONFile) {
    const jsFilesArr = jsFiles
    
    for (let i = 1; i <= appAmount; i++) {
        const arr = json.batch.application
        arr.push({
            ...updateAppObject(v4(), `App Name ${i}`)
        })
    }

    for (let i = 1; i <= fieldAmount; i++) {
        const arr = json.batch.field
        arr.push({
            ...updateFieldObject(v4(), `Field Name ${i}`)
        })
    }

    for (let i = 1; i <= tableAmount; i++) {
        const arr = json.batch.table
        arr.push({
            ...updateTableObject(v4(), `Table Name ${i}`)
        })
    }

    for (let i = 1; i <= flowAmount; i++) {
        const arr = json.batch.flow
        arr.push({
            ...updateFlowObject(v4(), `Flow Name ${i}`, jsFilesArr[i - 1])
        })
    }
    
    if (fs.readdirSync("./GeneratedData")[0] === undefined) {
        fs.writeFileSync("./GeneratedData/GeneratedJSONdata.json", JSON.stringify(toJSONFile))
    } else {
        fs.unlinkSync("./GeneratedData/GeneratedJSONdata.json")
        fs.writeFileSync("./GeneratedData/GeneratedJSONdata.json", JSON.stringify(toJSONFile))
    }
}

function isEmpty(arr) {
    return arr[arr.length - 1] === undefined
}

async function main() {
    console.log("Generating JSON...")
    generateJSON(5, 5, 5, 1, getJSFilesFromFolder(), json)
}
main()