require('dotenv').load()

const path = require('path')
const env = process.env

module.exports = {
  rootDir: __dirname,
  srcDir: path.join(__dirname, 'client'),

  router: {
    linkActiveClass: 'is-active'
  },

  env: {
    HOST: env.HOST,
    CLIENT_PORT: env.CLIENT_PORT,
    SERVER_PORT: env.SERVER_PORT,
    PROTOCOL: env.PROTOCOL,
    API_PREFIX: env.API_PREFIX,
    AJAX_URL_NO_PORT: env.AJAX_URL_NO_PORT,
    TOKEN_SERVICE_ENDPOINT: env.TOKEN_SERVICE_ENDPOINT,
    LOCAL_SERVICE_ENDPOINT: env.LOCAL_SERVICE_ENDPOINT,
    USERNAME_FIELD: env.USERNAME_FIELD,
    TOKEN_LOCAL_STORAGE_KEY: env.TOKEN_LOCAL_STORAGE_KEY
  },

  build: {
    vendor: [
      'feathers',
      'feathers-rest',
      'feathers-hooks',
      'feathers-authentication',
      'axios',
      'vuelidate',
      'validator'
    ]
  },

  plugins: [
    '~plugins/vuelidate'
  ]
}
