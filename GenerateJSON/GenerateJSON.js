const fs = require("fs")
const { v4 } = require("uuid")
const { updateFlowObject, updateFieldObject, updateAppObject, updateTableObject } = require("./UpdateJSONObject")

function generateJSON(appAmount, fieldAmount, tableAmount, flowAmount, jsFiles, json) {
    console.log("Generating JSON...")
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

    if (fs.readdirSync(__dirname + "/GeneratedJSONData")[0] === undefined) {
        // fs.writeFileSync("/GeneratedJSONData/GeneratedJSONdata.json", JSON.stringify(json))
        const stream = fs.createWriteStream(__dirname + "/GeneratedJSONData/GeneratedJSONdata.json")
        stream.write(JSON.stringify(json), (data) => console.log(data))
    } else {
        fs.unlinkSync(__dirname + "/GeneratedJSONData/GeneratedJSONdata.json")
        // fs.writeFileSync(__dirname + "/GeneratedJSONData/GeneratedJSONdata.json", JSON.stringify(json))
        const stream = fs.createWriteStream(__dirname + "/GeneratedJSONData/GeneratedJSONdata.json")
        stream.write(JSON.stringify(json), (data) => console.log(data))
        
    }
}

module.exports = { generateJSON }