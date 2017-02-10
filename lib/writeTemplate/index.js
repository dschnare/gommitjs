const fs = require('fs')
const path = require('path')
const getGommitBinaryPath = require('../getGommitBinaryPath')

module.exports = function writeGommitConfig (templateName, { prefix = '', mode = 0o666, overwrite = false } = {}) {
  const templatePath = path.join(__dirname, `../../templates/${templateName}`)
  const destPath = path.join(prefix, templateName)
  const gommit = getGommitBinaryPath()

  return new Promise((resolve, reject) => {
    fs.stat(destPath, (error, stats) => {
      resolve(!!error)
    })
  }).then(configNotFound => {
    if (overwrite || configNotFound) {
      return new Promise((resolve, reject) => {
        fs.readFile(templatePath, 'utf8', (error, text) => {
          error ? reject(error) : resolve(text)
        })
      }).then(text => {
        return text
          .replace(/%gommit%/g, gommit)
          // NOTE: We can add other tokens we need to replace here.
      }).then(text => {
        return new Promise((resolve, reject) => {
          fs.writeFile(destPath, text, { encoding: 'utf8', mode }, error => {
            error ? reject(error) : resolve({
              path: destPath,
              state: overwrite && !configNotFound ? 'overwritten' : 'written'
            })
          })
        })
      })
    } else {
      return { path: destPath, state: 'unmodified' }
    }
  })
}
