/* globals describe, it, before, after */

require('dotenv').load()

const path = require('path')
const chai = require('chai')
const Nuxt = require('nuxt')

const assert = chai.assert
const rootDir = path.join(__dirname, '../..')
const configPath = path.join(rootDir, 'nuxt.config')
const config = require(configPath)

config.rootDir = rootDir
config.dev = false

describe('User Service - Client', function () {
  this.timeout(60000)

  before(done => {
    this.nuxt = new Nuxt(config)

    this.nuxt.build()
    .then(() => {
      this.server = new this.nuxt.Server(this.nuxt)
      this.server.listen(process.env.TEST_PORT)
      done()
    })
    .catch(err => { throw new Error(err) })
  })

  after(() => {
    this.server.close()
    this.nuxt.close()
  })

  it('should have defined the nuxt and server instances', () => {
    assert.isOk(this.nuxt)
    assert.isOk(this.server)
  })
})
