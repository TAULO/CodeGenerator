// function getJSFilesFromFolder() {
//     const jsFiles = readdirSync("./JSFiles")
//     return jsFiles.map((file, index) => { 
//         // if(index > 10000) return
//         return readFileSync(`./JSFiles/${file}`).toString() 
//     })
// }

import fs from "fs"
import path from "path"

function getJSFilesFromFolder(cap) {
    const folderPath = './JSFiles'
  
    return new Promise((resolve, reject) => {
      const jsFiles = []
      const files = fs.readdirSync(folderPath)
  
      let index = 0
      const processNextFile = () => {
        if (index >= cap || index >= files.length) {
          resolve(jsFiles)
          return
        }
  
        const file = files[index]
        const filePath = path.join(folderPath, file)
        const readStream = fs.createReadStream(filePath, { encoding: 'utf8' })
        let fileData = ''
  
        readStream.on('data', (chunk) => {
          fileData += chunk
        });
  
        readStream.on('end', () => {
          jsFiles.push(fileData)
          index++
          processNextFile()
        });
  
        readStream.on('error', (error) => {
          reject(error)
        });
      };
  
      processNextFile()
    });
  }

export default getJSFilesFromFolder