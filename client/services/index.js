const services = [
  'users',
  'posts'
]

import feathers from 'feathers/client'
import rest from 'feathers-rest/client'
import hooks from 'feathers-hooks'
import authentication from 'feathers-authentication/client'
import axios from 'axios'

let host = process.env.PROTOCOL + process.env.HOST

if (process.env.AJAX_URL_NO_PORT !== 'true') {
  host += ':' + process.env.SERVER_PORT
}

const authOpt = {
  tokenEndpoint: process.env.TOKEN_SERVICE_ENDPOINT,
  localEndpoint: process.env.LOCAL_SERVICE_ENDPOINT,
  tokenKey: process.env.TOKEN_LOCAL_STORAGE_KEY
}

if (process.BROWSER_BUILD) {
  authOpt.storage = window.localStorage
}

const app = feathers()
  .configure(rest(host).axios(axios))
  .configure(hooks())
  .configure(authentication(authOpt))

const retObj = { app }

for (let service of services) {
  retObj[service] = app.service(process.env.API_PREFIX + '/' + service)
}

export default retObj
