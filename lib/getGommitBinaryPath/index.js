const path = require('path')
const gommitMetadata = require('../gommitMetadata')

module.exports = function getGommitBinaryPath ({ url = '', prefix = '' } = {}) {
  if (!url || !prefix) {
    return gommitMetadata.load().then(metadata => {
      return metadata.path
    })
  } else {
    return Promise.resolve(path.resolve(`${prefix}/gommit${path.extname(url)}`))
  }
}
