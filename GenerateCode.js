const { v4 } = require("uuid")
const fs = require("fs")
const axios = require("axios")
const { Octokit } = require("@octokit/core");

async function getRateLimit(octokit) {
    const rate = await octokit.request('GET /rate_limit', {})
    return { 
        rate: rate.data.rate,
        search: rate.data.resources.search
    }
}

function getJSFilesFromFolder() {
    const jsFiles = fs.readdirSync("./JSFiles", ((err => err ? console.log(err) : console.log("success"))))
    return jsFiles.map(file => fs.readFileSync(`./JSFiles/${file}`).toString())
}

async function getJSCodeFromGithub(octokit) {
    let page = 100
    const searchCodeRes = await octokit.request(`GET /search/code?q=extension:js+language:JavaScript?page:${page}`, {
        headers: {
            authorization: "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"
        }
    })
    const linkArr = searchCodeRes.data.items.map(item => item.url)
    const jsFilesArr = []

    for (let i = 0; i < 5; i++) {
        const downloadLinkRes = await axios.get(linkArr[i])
        const { name, download_url } = downloadLinkRes.data

        const rawFileRes = await axios.get(download_url)
        if (getJSFilesFromFolder().includes(rawFileRes.data)) {
            console.log(name + " already exits")
            page++
            break;
        } else {
            jsFilesArr.push({
                fileName: name,
                data: rawFileRes.data
            })
        }
    }
    console.log("Page:", page)
    return jsFilesArr
}

async function writeJSFilesToFolder(arr) {
    const jsFilesArr = await arr

    jsFilesArr.forEach(file => {
        fs.appendFileSync(`./JSFiles/${v4()}____${file.fileName}`, file.data, (err) => err ? console.log(err) : console.log("success"))
        console.log(`Added {${file.fileName}} to ./JSFiles`)
    })
}

async function main() {
    const octokit = new Octokit({
        auth: "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"
    })

    const { rate, search } = await getRateLimit(octokit)
    for (let i = 0; i < 1; i++) {
        if (search.remaining < 3 || rate.remaining < 5) {
            console.log("API Rate limit almost reached. Requsting in 60 seconds...", "Search limit: " + search.remaining, "Rate limit: " + rate.remaining)
            setTimeout(async () => {
                writeJSFilesToFolder(await getJSCodeFromGithub(octokit))
            }, 60000)    
        } else {
            console.log("Requsting in 20 seconds...")
            setTimeout(async () => {
                writeJSFilesToFolder(await getJSCodeFromGithub(octokit))
                console.log("Search limit: " + search.remaining, "Rate limit: " + rate.remaining)
            }, 20000)
        }
    }
}
main()

module.exports = { getJSFilesFromFolder }
