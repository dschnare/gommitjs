const httpGet = require('../httpGet')

const latestUrl = 'https://github.com/antham/gommit/releases/latest'

module.exports = function getLatestTag () {
  return httpGet(latestUrl, { maxFollowLocationDepth: 0 }).then(res => {
    return res.headers['location'].split('/').pop()
  })
}
