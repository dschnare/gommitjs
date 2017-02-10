const path = require('path')
const fs = require('fs')
const installGommit = require('../lib/installGommit')

const tag = 'latest'
installGommit(tag).then(({ binaryPath, tag }) => {
  console.log(`gommit ${tag} installed at ${binaryPath}`)
}).catch(error => {
  console.error(error)
})
