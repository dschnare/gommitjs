const fs = require('fs')
const path = require('path')
const mkdir = require('../mkdir')
const httpGet = require('../httpGet')
const getGommitUrl = require('../getGommitUrl')
const getGommitBinaryPath = require('../getGommitBinaryPath')

module.exports = function installGommit (tag = 'latest', { prefix = null } = {}) {
  prefix = prefix || path.join(__dirname, '../../tools')

  return getGommitUrl(tag).then(url => {
    const dest = path.resolve(getGommitBinaryPath({ url, prefix }))

    return mkdir(path.dirname(dest)).then(() => {
      return httpGet(url).then(stream => {
        return new Promise((resolve, reject) => {
          const w = fs.createWriteStream(dest, { mode: 0o755 })
          stream.pipe(w)
            .on('error', error => reject(error))
            .on('close', () => resolve(dest))
        })
      })
    }).then(() => {
      // url ends with: .../tag/filename
      const segments = url.split('/')
      segments.pop()
      const tag = segments.pop()
      const oldPath = getGommitBinaryPath()

      return writeGommitInfo(dest, tag).then(() => {
        return { path: dest, tag }
      }).then(result => {
        const isOverwritting = oldPath === dest
        return isOverwritting ? result : removeOldGommitBinary(oldPath).then(() => result).catch(error => {
          return Promise.reject(new Error(`Failed to remove previously installed gommit binary : ${error}`))
        })
      })
    })
  })
}

function removeOldGommitBinary (oldPath) {
  return new Promise((resolve, reject) => {
    if (oldPath) {
      fs.unlink(oldPath, error => {
        error ? reject(error) : resolve()
      })
    } else {
      resolve()
    }
  })
}

function writeGommitInfo (gommitBinaryPath, tag) {
  const pkgPath = path.join(__dirname, '../../package.json')
  const pkg = require(pkgPath)

  pkg.$gommit = {
    path: gommitBinaryPath, tag
  }

  return new Promise((resolve, reject) => {
    fs.writeFile(pkgPath, JSON.stringify(pkg, null, 2), error => {
      error ? reject(error) : resolve()
    })
  })
}
