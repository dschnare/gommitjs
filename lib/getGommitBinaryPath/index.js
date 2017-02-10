const path = require('path')

module.exports = function getGommitBinaryPath ({ url = '', prefix = '' } = {}) {
  if (!url || !prefix) {
    const pkgPath = path.join(__dirname, '../../package.json')
    const $gommit = require(pkgPath).$gommit || {}
    return $gommit.path
  } else {
    return `${prefix}/gommit${path.extname(url)}`
  }
}
