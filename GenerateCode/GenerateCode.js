import { v4 } from "uuid";
import { appendFileSync } from "fs";
import axios  from "axios";
import { Octokit } from "@octokit/core";
import getJSFilesFromFolder from "../GetJSFiles.js";

const sleep = (delay) => new Promise((resolve) => setTimeout(resolve, delay));

import dotenv from 'dotenv';
dotenv.config();

const fgRed = "\x1b[31m"
const fgGreen = "\x1b[32m"
const fgYellow = "\x1b[33m"
const fgBlue = "\x1b[34m"
const fgWhite = "\x1b[37m"

async function getRateLimit(octokit) {
    const response = await octokit.request('GET /rate_limit')
    const resetTime = response.headers['x-ratelimit-reset'];
    return { 
        rate: response.data.rate,
        search: response.data.resources.search,
        resetTime,
    }
}

let page = 1
const per_page = 100
let min_size = 52000
let max_size = 53000

async function getJSCodeFromGithub(octokit, token) {
    try {
        const requestURL = `GET /search/code?q=extension:js+language:JavaScript+size:${min_size}..${max_size}`
        let searchCodeRes = await octokit.request(`${requestURL}&page=${page}&per_page=${per_page}`)
        
        const limit = searchCodeRes.headers["x-ratelimit-used"]
        if (limit > 10) {  
            console.log(`Close to limit: ${limit}/10, sleeing for 60 seconds`)        
            await sleep(60000) 
        }
    
        const linkArr = searchCodeRes.data.items.map(item => item.url)
        const jsFilesArr = []
    
        console.log(fgBlue, `Total downloaded files: ${getJSFilesFromFolder().length}`)
        console.log(fgBlue, `Searching through ${linkArr.length} files...`)
        for (let i = 0; i < linkArr.length; i++) {
            const index = i + 1
            console.log(fgWhite, `Searching on page: ${page}/${per_page} at index: ${index}/${linkArr.length}`)
            const config = {
                headers: { Authorization: `Bearer ${token}` }
            };
            const downloadLinkRes = await axios.get(linkArr[i], config)
            const { name, content, path } = downloadLinkRes.data
            const rawFileData = Buffer.from(content, "base64").toString() 
            // if (getJSFilesFromFolder().includes(rawFileData)) {
            //     console.log(fgYellow, `${name} already exits on page ${page} at ${index}`)
            // } else {
                jsFilesArr.push({
                    fileName: name,
                    data: rawFileData
                })
                appendFileSync(`./JSFiles/${v4()}____${name}`, rawFileData)
                console.log(fgGreen, `Added: ${name} from ${path} to ./JSFiles`)
            // }
        }
        jsFilesArr.forEach(file => console.log(fgBlue, `Added:  {${file.fileName}}`))
        console.log(console.log(fgBlue, `${jsFilesArr.length} files added. Total of ${getJSFilesFromFolder().length}`))
        return jsFilesArr
    } catch(error) {
        if (error.response.status === 403) {
            const { rate } = await getRateLimit(octokit)
            console.log(fgRed, `Rate limit exceeded. Rate: ${rate.remaining}\n trying again in 60 seconds...`)
            await sleep(60000)
            return getJSCodeFromGithub(octokit)
        } else {
            console.log(error)
        }
    }
}

async function callAPI(octokit, token) {
    for (let i = 0; i < 5000; i++) {
        const { rate, search } = await getRateLimit(octokit)
        console.log(fgWhite, "Requesting...")
        await getJSCodeFromGithub(octokit, token)
        page++
        if (page > 10) {
            min_size += 1000
            max_size += 1000
            page = 1
        }
        console.log(fgWhite, `Search limit: ${search.remaining} -- Rate limit: ${rate.remaining}`)
    }
}

async function generateCode(token) {
    const octokit = new Octokit({
        auth: token
    })
    
    callAPI(octokit, token)
    .then(() => console.log("Generating code..."))
    .catch(e => console.log(e))
}

export default generateCode 
