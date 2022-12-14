const fs = require("fs")
const { v4 } = require("uuid")
const { updateFlowObject, updateFieldObject, updateAppObject, updateTableObject } = require("./UpdateJSONObject")
const JSONStream = require( "JSONStream" );
const bigJSON = require('big-json');


function generateJSON(appAmount, fieldAmount, tableAmount, jsFiles, json) {
    console.log("Generating JSON...")

    const jsonStream = JSONStream.stringify()
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

    for (let i = 1; i <= 5; i++) {
        const arr = json.batch.flow
        arr.push({
            ...updateFlowObject(v4(), `Flow Name ${i}`, jsFilesArr[i - 1])
        })
    }

    try {
        // const stream = fs.createWriteStream(__dirname + "/GeneratedJSONData/GeneratedJSONdata.json")

        const stream = fs.createWriteStream(__dirname + "/GeneratedJSONdata.json")

        // if (fs.readdirSync(__dirname + "/GeneratedJSONData")[0] === undefined) {
        //     // fs.writeFileSync("/GeneratedJSONData/GeneratedJSONdata.json", JSON.stringify(json))
        //     stream.write(json, (err) => err ? console.log(err) : console.log("success"))
        //     // fs.writeFile("/GeneratedJSONData/GeneratedJSONdata.json", JSON.stringify(json), (err) => err ? console.log(err) : console.log("success"))
        // } else {
        //     fs.unlinkSync(__dirname + "/GeneratedJSONData/GeneratedJSONdata.json")
        //     // fs.writeFileSync(__dirname + "/GeneratedJSONData/GeneratedJSONdata.json", JSON.stringify(json))
        //     stream.write(json, (err) => err ? console.log(err) : console.log("success"))   
        //     // fs.writeFile("/GeneratedJSONData/GeneratedJSONdata.json", JSON.stringify(json), (err) => err ? console.log(err) : console.log("success"))
        // }

        // jsonStream.pipe(stream) 

        // json.batch.application.forEach( jsonStream.write )
        // json.batch.field.forEach( jsonStream.write )
        // json.batch.table.forEach( jsonStream.write )
        // json.batch.flow.forEach( jsonStream.write )

        // jsonStream.end()

        const stringifyStream = bigJSON.createStringifyStream({
            body: json
        });

        stringifyStream.on('data', function(strChunk) {
            fs.appendFileSync("GeneratedJSONdata.json", strChunk)
            console.log(strChunk)
        });

        stream.on(
            "finish",
            () => {
                console.log("Done");
            }
        );

    } catch (e) {
        console.log(e)
    }
}

module.exports = { generateJSON }