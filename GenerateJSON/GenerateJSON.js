import { createWriteStream, appendFileSync } from "fs";
import { v4 } from "uuid";
// import default from "./UpdateJSONObject";
import { updateFlowObject, updateFieldObject, updateAppObject, updateTableObject } from "./UpdateJSONObject.js";
import { createStringifyStream } from 'big-json';
import path from 'path';

const __dirname = path.dirname(new URL(import.meta.url).pathname);


function generateJSON(appAmount, fieldAmount, tableAmount, jsFiles, json) {
    console.log("Generating JSON...")

    // const jsonStream = stringify()
    // const jsFilesArr = jsFiles

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
        console.log("Field: " + i)
    }

    for (let i = 1; i <= tableAmount; i++) {
        const arr = json.batch.table
        arr.push({
            ...updateTableObject(v4(), `Table Name ${i}`)
        })
        console.log("Table: " + i)
    }

    for (let i = 1; i <= 5; i++) {
        const arr = json.batch.flow
        arr.push({
            // ...updateFlowObject(v4(), `Flow Name ${i}`, jsFilesArr[i - 1])
        })
    }

    return json

    // try {
    //     const filePath = path.join(__dirname, '/GeneratedJSONdata.json')
    //     const decodedFilePath = decodeURIComponent(filePath);
    //     const stream = createWriteStream(decodedFilePath);
    //     const stringifyStream = createStringifyStream({
    //         body: json
    //     });

    //     stringifyStream.on('data', (strChunk) => {
    //         appendFileSync("GeneratedJSONdata.json", strChunk)
    //         console.log(strChunk)
    //     });

    //     stream.on(
    //         "finish",
    //         () => {
    //             console.log("Done");
    //         }
    //     );

    // } catch (e) {
    //     console.log(e)
    // }
}

export default generateJSON