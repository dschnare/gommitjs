const assert = require('assert')
const { gommit } = require('../index')

/* eslint-env mocha */

describe('gommit', function () {
  describe('#version', function () {
    it('should return the version number', function (done) {
      gommit([ 'version' ])
        .then(version => {
          assert.strictEqual(version, 'v2.0.0')
          done()
        })
        .catch(done)
    })
  })

  describe('#checkMessage', function () {
    it('should reject when the message is not formatted correctly', function (done) {
      gommit.checkMessage('Hello').then(() => {
        done(new Error('Message is valid'))
      }).catch(() => done())
    })

    it('should resolve when the message is formatted correctly', function (done) {
      gommit.checkMessage('fix(module): Message').then(() => {
        done()
      }).catch(done)
    })

    it('should resolve for an extended message', function (done) {
      const message = [
        'feature(api): Add Nodejs API wrapper',
        '',
        'Add Nodejs API wrapper so gommit can be called from Node.',
        'Add Nodejs API wrapper so gommit can be called from Node.',
        '',
        'Add ESLint integration to the project.',
        '',
        'Add API section to README.',
        'Add API section to README.',
        '',
        'Update gommit config so that summary length is not checked.',
        '',
        '# Please enter the commit message for your changes. Lines starting',
        '# with \'#\' will be ignored, and an empty message aborts the commit.',
        '# On branch master',
        '# Changes to be committed:',
        '#       new file:   .eslintrc.json',
        '#       modified:   CHANGELOG.md',
        '#       modified:   README.md',
        '#       new file:   lib/gommit/index.js',
        '#       new file:   lib/gommit/index.test.js',
        '#       modified:   lib/index.js',
        '#       modified:   package.json',
        '#',
        '# Changes not staged for commit:',
        '#       modified:   .gommit.toml',
        '#'
      ].join('\n')

      gommit.checkMessage(message).then(() => {
        done()
      }).catch(done)
    })
  })
})
