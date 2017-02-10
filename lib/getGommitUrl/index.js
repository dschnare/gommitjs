const os = require('os')
const getLatestTag = require('../getLatestTag')

const baseUrl = 'https://github.com/antham/gommit/releases/download'

module.exports = function getGommitUrl (tag = 'latest') {
  return (tag === 'latest' ? getLatestTag(tag) : Promise.resolve(tag))
    .then(tag => {
      switch (os.platform()) {
        case 'darwin':
          return `${baseUrl}/${tag}/gommit_darwin_amd64`
        case 'win32':
          return `${baseUrl}/${tag}/gommit_windows_amd64.exe`
        case 'linux':
          return `${baseUrl}/${tag}/gommit_linux_amd64`
        case 'freebsd':
          return `${baseUrl}/${tag}/gommit_freebsd_amd64`
        default:
          return Promise.rejecrt(new Error(`Unsupported OS "${os.platform()}"`))
      }
    })
}
