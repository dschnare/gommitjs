const installGommit = require('../lib/installGommit')

const tag = 'latest'
installGommit(tag).then(({ path, tag }) => {
  console.log(`gommit ${tag} installed at ${path}`)
}).catch(error => {
  console.error(error)
})
