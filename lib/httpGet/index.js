const http = require('https')
const { parse: parseUrl } = require('url')

module.exports = function httpGet (url, { maxFollowLocationDepth = Infinity } = {}) {
  const parsedUrl = parseUrl(url)
  return new Promise((resolve, reject) => {
    let options = {
      headers: { 'Accept':  '*/*' }
    }
    ;({
      hostname: options.hostname,
      path: options.path,
      protocol: options.protocol
    } = parsedUrl)

    http.get(options, res => {
      const { statusCode } = res
      const contentType = res.headers['content-type']
      const location = res.headers['location']

      if (location) {
        if (maxFollowLocationDepth <= 0) {
          resolve(res)
        } else {
          res.resume()
          maxFollowLocationDepth -= 1
          httpGet(location, { maxFollowLocationDepth })
            .then(resolve).catch(reject)
        }
      } else {

        let error = null
        if (statusCode !== 200) {
          error = new Error(`Request failed. Status code ${statusCode}.`)
        }

        if (error) {
          // Free up memory by switching the response stream into flowing mode,
          // thereby emitting data events and consuming the data in the stream.
          res.resume()
          reject(error)
          return
        }

        resolve(res)
      }
    })
  })
}
