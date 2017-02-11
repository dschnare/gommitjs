const os = require('os')
const getLatestTag = require('../getLatestTag')

const baseUrl = 'https://github.com/antham/gommit/releases/download'

module.exports = function getGommitUrl (tag = 'latest') {
  return (tag === 'latest' ? getLatestTag(tag) : Promise.resolve(tag))
    .then(tag => {
      let arch = null

      try {
        arch = getArch()
      } catch (error) {
        return Promise.reject(error)
      }

      switch (os.platform()) {
        case 'darwin':
          return `${baseUrl}/${tag}/gommit_darwin_${arch}`
        case 'win32':
          return `${baseUrl}/${tag}/gommit_windows_${arch}.exe`
        case 'linux':
          return `${baseUrl}/${tag}/gommit_linux_${arch}`
        case 'freebsd':
          return `${baseUrl}/${tag}/gommit_freebsd_${arch}`
        case 'openbsd':
          return `${baseUrl}/${tag}/gommit_openbsd_${arch}`
        default:
          return Promise.rejecrt(new Error(`Unsupported OS "${os.platform()}"`))
      }
    })
}

function getArch () {
  switch (os.arch()) {
    case 'x64':
      return 'amd64'
    case 'x32':
    case 'x86':
      return '386'
    case 'arm':
      return 'arm'
    default:
      throw new Error(`Unsupported architecture "${os.arch()}"`)
  }
}
