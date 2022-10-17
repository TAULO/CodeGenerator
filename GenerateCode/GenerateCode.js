const { v4 } = require("uuid")
const fs = require("fs")
const axios = require("axios")
const { Octokit } = require("@octokit/core");
const sleep = require('util').promisify(setTimeout)
const { getJSFilesFromFolder } = require("../GetJSFiles")

require('dotenv').config();

const fgRed = "\x1b[31m"
const fgGreen = "\x1b[32m"
const fgYellow = "\x1b[33m"
const fgBlue = "\x1b[34m"
const fgWhite = "\x1b[37m"

async function getRateLimit(octokit) {
    const rate = await octokit.request('GET /rate_limit', {})
    return { 
        rate: rate.data.rate,
        search: rate.data.resources.search
    }
}

let page = 1
const per_page = 100
let min_size = 22000
let max_size = 23000

async function getJSCodeFromGithub(octokit) {
    const requestURL = `GET /search/code?q=extension:js+language:JavaScript+size:${min_size}..${max_size}`
    let searchCodeRes = await octokit.request(`${requestURL}&page=${page}&per_page=${per_page}`, {
        headers: {
            authorization: process.env.PRIVATE_TOKEN
        }
    })
    const linkArr = searchCodeRes.data.items.map(item => item.url)
    const jsFilesArr = []

    console.log(fgBlue, `Total files: ${getJSFilesFromFolder().length}`)
    console.log(fgBlue, `Searching through ${linkArr.length} files...`)

    for (let i = 0; i < linkArr.length; i++) {
        const index = i + 1
        const { rate, search } = await getRateLimit(octokit)
        console.log(fgWhite, `Search limit: ${search.remaining} -- Rate limit: ${rate.remaining}`)
        console.log(fgWhite, `Searching on page: ${page} -- index: ${index}`)

        const downloadLinkRes = await axios.get(linkArr[i], {
            headers: {"Authorization": process.env.PRIVATE_TOKEN}
        })
        const { name, content, path } = downloadLinkRes.data
        const rawFileData = Buffer.from(content, "base64").toString() 

        // const lastDownloadLinkRes = await axios.get(linkArr[linkArr.length - 1], {
        //     headers: {"Authorization": process.env.PRIVATE_TOKEN}
        // })
        // const lastRawFileData = Buffer.from(lastDownloadLinkRes.data.content, "base64").toString()
        // if (getJSFilesFromFolder().includes(lastRawFileData)) {
        //     console.log("The last file:", name, "already exits on page", page)
        //     page++
        //     console.log("Current page:", page)
        //     console.log("Waiting 60 seconds for next api call")
        //     await sleep(60000)

        //     searchCodeRes = await octokit.request(`${requestURL}&page=${page}&per_page=${per_page}`, {
        //         headers: {
        //             authorization: process.env.PRIVATE_TOKEN
        //         }
        //     })
        //     linkArr = searchCodeRes.data.items.map(item => item.url)
        // } else 
        if (getJSFilesFromFolder().includes(rawFileData)) {
            console.log(fgYellow, `${name} already exits on page ${page} and index ${index}`)
        } else {
            jsFilesArr.push({
                fileName: name,
                data: rawFileData
            })
            console.log(fgGreen, `Added: ${name} from ${path} to jsFilesArr`)
        }
    }
    return jsFilesArr
}

async function writeJSFilesToFolder(arr) {
    const jsFilesArr = await arr

    jsFilesArr.forEach(async (file) => {
        fs.appendFileSync(`./JSFiles/${v4()}____${file.fileName}`, file.data)
        console.log(fgBlue, `Added: {${file.fileName}} to ./JSFiles`)
    })
    console.log(console.log(fgBlue, `${jsFilesArr.length} files added`))
}

async function callAPI() {
    const octokit = new Octokit({
        auth: process.env.PRIVATE_TOKEN
    })
    for (let i = 0; i < 1000; i++) {
        const { rate, search } = await getRateLimit(octokit)
        if (search.remaining < 3 || rate.remaining < 200) {
            const wait = 15 * 6000
            console.log(fgRed, `API Rate limit almost reached. Requesting in ${wait / 6000} minutes...`)
            console.log(fgWhite, "Search limit: " + search.remaining, "Rate limit: " + rate.remaining)
            await sleep(wait)
            await writeJSFilesToFolder(await getJSCodeFromGithub(octokit))
        } else {
            console.log(fgWhite, "Requesting...")
            await writeJSFilesToFolder(await getJSCodeFromGithub(octokit))
            console.log(fgWhite, "Search limit: " + search.remaining, "Rate limit: " + rate.remaining)
            console.log(fgWhite, "Waiting 60 seconds for next request")
            page++
            if (page > 10) {
                min_size += 1000
                max_size += 1000
                page = 1
            }
            await sleep(60000)
        }
    }
}

function generateCode() {
    console.log("Generating code...")
    callAPI()
}

module.exports = { generateCode }
