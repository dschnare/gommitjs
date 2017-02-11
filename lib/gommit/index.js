const { exec } = require('child_process')
const getGommitBinaryPath = require('../getGommitBinaryPath')

function gommit (args, { cwd = process.cwd() } = {}) {
  const gommit = getGommitBinaryPath()
  return new Promise((resolve, reject) => {
    exec(`${gommit} ${args.join(' ')}`, { cwd }, (error, stdout, stderr) => {
      if (error || stderr) {
        reject(new Error((stderr || stdout).trim()))
      } else {
        resolve(stdout.trim())
      }
    })
  })
}

gommit.checkCommit = function checkCommit (commitHash, { config } = {}) {
  const args = [ 'check', 'commit', JSON.stringify(commitHash) ]
  if (config) {
    args.push('--config', config)
  }
  return gommit(args)
}

gommit.checkMessage = function checkMessage (message, { config } = {}) {
  const args = [ 'check', 'message', JSON.stringify(message) ]
  if (config) {
    args.push('--config', config)
  }
  return gommit(args)
}

gommit.checkRange = function checkRange (refStart, refEnd, { config } = {}) {
  const args = [ 'check', 'range', JSON.stringify(refStart), JSON.stringify(refEnd) ]
  if (config) {
    args.push('--config', config)
  }
  return gommit(args)
}

gommit.version = function version (command) {
  return gommit([ 'version' ])
}

module.exports = gommit
