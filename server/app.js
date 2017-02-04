/* global Helpers, Middlewares, Hooks, Services */

require('dotenv').load()

const path = require('path')
const compress = require('compression')
const bodyParser = require('body-parser')
const ekso = require('ekso')
const mongoose = require('mongoose')
const chalk = require('chalk')
const cors = require('cors')
const feathers = require('feathers')
const hooks = require('feathers-hooks')
const rest = require('feathers-rest')
const mongooseService = require('feathers-mongoose')
const authentication = require('feathers-authentication')
const Nuxt = require('nuxt')

const env = process.env
const dbUrl = env.NODE_ENV === 'testing' ? env.TEST_MONGODB_URL : env.MONGODB_URL
const isProd = (env.NODE_ENV === 'production')
const app = feathers()
const servicesArr = []

const log = (context, message) => {
  if (env.NODE_ENV !== 'testing') {
    console.log(chalk.green(`[${context}]`), chalk.yellow(message))
  }
}

chalk.enabled = true

ekso({
  rootDir: __dirname,
  global: true,
  pathTransforms: ['capitalize'],
  nameTransforms: ['camelCase'],
  globalRequire: {
    _: 'lodash'
  }
}, [
  'helpers',
  'middlewares',
  'hooks',
  'services'
])

app
.use(compress())
.use(bodyParser.json())
.use(bodyParser.urlencoded({ extended: true }))

if (!isProd) {
  app.use(cors())
}

for (let middlewareName in Middlewares) {
  app.use(Middlewares[middlewareName](app))
}

app
.configure(hooks())
.configure(rest())
.configure(authentication({
  userEndpoint: env.USERS_SERVICE_ENDPOINT,
  tokenEndpoint: env.TOKEN_SERVICE_ENDPOINT,
  localEndpoint: env.LOCAL_SERVICE_ENDPOINT,
  local: {
    usernameField: env.USERNAME_FIELD
  },
  token: {
    secret: env.TOKEN_SECRET,
    expiresIn: env.TOKEN_EXPIRES_IN
  }
}))

for (let serviceName in Services) {
  const servicePath = `${env.API_PREFIX}/${serviceName.toLowerCase()}`
  let serviceObj = Services[serviceName]
  serviceObj.options.Model = serviceObj.model(mongoose)

  app.use(servicePath, mongooseService(serviceObj.options))
  app.service(servicePath).before(serviceObj.hooks.before)
  app.service(servicePath).after(serviceObj.hooks.after)
  servicesArr.push(`${servicePath} -> Services.${serviceName}`)

  Services[serviceName] = app.service(servicePath)
}

if (isProd) { // nuxt will be run in own process in development
  const nuxtCfgPath = path.join(__dirname, '../nuxt.config.js')
  const nuxtCfg = require(nuxtCfgPath)
  nuxtCfg.dev = false
  const nuxt = new Nuxt(nuxtCfg)

  app.use(nuxt.render)
}

log('Helpers', Object.keys(Helpers).join(', '))
log('Middlewares', Object.keys(Middlewares).join(', '))
log('Hooks', Object.keys(Hooks).join(', '))
log('Services', servicesArr.join(', '))

mongoose.connection.on('open', () => {
  log('Database', `Connected to ${dbUrl}`)
})

mongoose.connection.on('error', err => {
  log('Database', chalk.red(err.message))
})

mongoose.connect(dbUrl)
mongoose.Promise = global.Promise

module.exports = app
