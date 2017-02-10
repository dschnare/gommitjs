const path = require('path')
const fs = require('fs')

module.exports = function mkdir (dirPath) {
  return new Promise((resolve, reject) => {
    fs.stat(dirPath, (error, stats) => {
      error ? reject(error) : resolve(stats)
    })
  }).then(stats => {
    if (!stats.isDirectory()) {
      return Promise.reject(
        new Error(`Cannot make a directory with a file in the path: ${dirPath}`)
      )
    }
  }).catch(() => {
    return mkdir(path.dirname(dirPath)).then(() => {
      return new Promise((resolve, reject) => {
        fs.mkdir(dirPath, error => {
          error ? reject(error) : resolve()
        })
      }).catch(error => {
        if (error.code === 'EEXIST') {
          return Promise.resolve()
        } else {
          return Promise.reject(error)
        }
      })
    })
  })
}
