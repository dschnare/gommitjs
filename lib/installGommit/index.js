const fs = require('fs')
const path = require('path')
const mkdir = require('../mkdir')
const httpGet = require('../httpGet')
const getGommitUrl = require('../getGommitUrl')
const getGommitBinaryPath = require('../getGommitBinaryPath')
const gommitMetadata = require('../gommitMetadata')

module.exports = function installGommit (tag = 'latest', { prefix = null } = {}) {
  prefix = prefix || path.join(__dirname, '../../tools')

  return getGommitUrl(tag).then(url => {
    return getGommitBinaryPath({ url, prefix }).then(dest => {
      return mkdir(path.dirname(dest)).then(() => {
        return httpGet(url).then(stream => {
          return new Promise((resolve, reject) => {
            const w = fs.createWriteStream(dest, { mode: 0o755 })
            stream.pipe(w)
              .on('error', error => reject(error))
              .on('close', () => resolve(dest))
          })
        })
      })
    }).then(dest => {
      // url ends with: .../tag/filename
      const segments = url.split('/')
      segments.pop()
      const tag = segments.pop()

      return getGommitBinaryPath().then(oldPath => {
        return writeGommitMetadata(dest, tag).then(() => {
          return { path: dest, tag, oldPath }
        })
      }).then(({ path, tag, oldPath }) => {
        const isOverwritting = oldPath === dest
        return isOverwritting
          ? { path, tag }
          : removeOldGommitBinary(oldPath)
              .then(() => ({ path, tag }))
              .catch(error => {
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

function writeGommitMetadata (gommitBinaryPath, tag) {
  return gommitMetadata.load().then(metadata => {
    metadata.path = gommitBinaryPath
    metadata.tag = tag
    return gommitMetadata.save(metadata)
  })
}
