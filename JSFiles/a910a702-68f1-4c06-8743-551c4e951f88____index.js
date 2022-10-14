const fs = require('fs-extra')
const jetpack = require('fs-jetpack')
const _exec = require('child_process').exec
const program = require('commander')
const path = require('path')
let folderPath = ''
let qtd = 2500
let extension = 'xml'

program
  .version('0.0.1')
  .option('-p, --path <path>', 'Folder that contains the xml files')
  .option('-q, --quantity [quantity]', 'Quantity per package. Default is 2500')
  .option('-e, --extension [extension]', 'The file extension. Default is xml')
  .parse(process.argv)

folderPath = program.path
qtd = program.quantity ? program.quantity : qtd
extension = program.extension ? program.extension.replace(/\W/g, '') : extension

const start = async () => {
  try {
    let results = []
    const files = jetpack.find(folderPath, { matching: `+(*.${extension.toLowerCase()}|*.${extension.toUpperCase()})`, recursive: true })
    const qtdArrays = Math.ceil(files.length / qtd)
    await fs.ensureDir(path.join(folderPath, 'output'))
    for (let index = 0; index < qtdArrays; index++) {
      let idx = index + 1
      const init = qtd * index
      const end = qtd * idx
      results = [...results, files.slice(init, end)]
      const outputName = `${idx}-${Math.round(new Date().getTime() * Math.random())}`
      fs.mkdirSync(path.join(folderPath, 'output', outputName))
      const sliced = files.slice(init, end)
      for (let file of sliced) {
        fs.copySync(file, path.join(folderPath, 'output', outputName, file.split('/').reverse()[0]), { overwrite: true })
      }
      await exec(`7z a ${path.join(folderPath, 'output', outputName)}.zip ${path.join(folderPath, 'output', outputName)} -o${path.join(folderPath, 'output', outputName)}.zip -r`)
      await fs.remove(path.join(folderPath, 'output', outputName))
    }
  } catch (error) {
    console.error(error)
    process.exit(0)
  }
}

const exec = async (command) => {
  return new Promise((resolve, reject) => {
    _exec(command, {maxBuffer: 200 * 1024 * 1024}, (err, out) => {
      if (err) {
        reject(err)
      } else {
        resolve(out)
      }
    })
  })
}

start()
