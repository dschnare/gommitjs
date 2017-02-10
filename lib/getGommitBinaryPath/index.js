const path = require('path')

module.exports = function getGommitBinaryPath ({ url = '', prefix = '' } = {}) {
  if (!url || !prefix) {
    const pkgPath = path.join(__dirname, '../../package.json')
    return require(pkgPath).$gommit
  } else {
    return `${prefix}/gommit${path.extname(url)}`
  }
}
