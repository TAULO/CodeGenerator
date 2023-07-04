import express from "express"
import bodyParser from "body-parser"
import getJSFilesFromFolder from "./GetJSFiles.js"

import generateCode from "./GenerateCode/GenerateCode.js"

import generateApps from "./JSON/generateApps.js"
import generateFlows from "./JSON/generateFlows.js"
import generateFields from "./JSON/generateFields.js"

import generateAll from "./JSON/generateAll.js"


const app = express();
const port = "9003";

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({
    extended: false
}))

// parse application/json
app.use(bodyParser.json())

const jsFiles = await getJSFilesFromFolder(1000)
 
app.post("/generateApps", (req, res) => {
    const { amount } = req.body
    res.send(generateApps(parseInt(amount)))
})

app.post("/generateFlows", async (req, res) => {
    const { amount } = req.body
    res.send(await generateFlows(parseInt(amount)))
})

app.post("/generateFields", (req, res) => {
    const { amount } = req.body
    res.send(generateFields(parseInt(amount)))
})

app.post("/generateAll", async (req, res) => {
    try {
        const { appAmount, flowAmount, fieldAmount } = req.body
        res.send(await generateAll(parseInt(appAmount), parseInt(flowAmount), parseInt(fieldAmount)))
    } catch(e) {
        res.send(e)
    }
})

app.post("/fetchCode", async (req, res) => {
    try {
        const { token } = req.body 
        await generateCode(token)
    } catch (e) {

    }
})

app.listen(port, () => {
    console.log(`Listening on http://localhost: ${port}`);
});