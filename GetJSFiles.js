const fs = require("fs")

function getJSFilesFromFolder() {
    const jsFiles = fs.readdirSync("./JSFiles", ((err => err ? console.log(err) : console.log("success"))))
    return jsFiles.map(file => fs.readFileSync(`./JSFiles/${file}`).toString())
}

module.exports = { getJSFilesFromFolder }