const path = require('path')
const fs = require('fs')

const metaPath = path.join(__dirname, '../../.gommit.meta.json')
let metadata = null

module.exports = {
  load () {
    if (metadata) {
      return Promise.resolve(JSON.parse(JSON.stringify(metadata)))
    }

    return new Promise((resolve, reject) => {
      fs.readFile(metaPath, 'utf8', (error, jsonText) => {
        if (error && error.code === 'ENOENT') {
          metadata = {}
          resolve(metadata)
        } else if (error) {
          reject(error)
        } else {
          try {
            metadata = JSON.parse(jsonText)
            resolve(metadata)
          } catch (error) {
            reject(error)
          }
        }
      })
    })
  },
  save (metadata) {
    return new Promise((resolve, reject) => {
      try {
        const jsonText = JSON.stringify(metadata, null, 2)
        fs.writeFile(metaPath, jsonText, 'utf8', error => {
          error ? reject(error) : resolve()
        })
      } catch (error) {
        reject(error)
      }
    })
  }
}
