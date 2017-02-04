const errors = require('feathers-errors')
const mongoose = require('mongoose')

const findOneByIdOrSlug = (hook) => {
  return new Promise((resolve, reject) => {
    if (mongoose.Types.ObjectId.isValid(hook.id)) {
      return resolve(hook)
    }

    hook.service.find({ query: { slug: hook.id } }).then(res => {
      if (!res.data[0]) {
        return reject(new errors.NotFound('Not found'))
      }

      hook.id = res.data[0]._id
      resolve(hook)
    })
    .catch(err => reject(err))
  })
}

module.exports = {
  before: {
    all: [],
    find: [],
    get: [findOneByIdOrSlug],
    create: [],
    update: [],
    patch: [],
    remove: []
  },

  after: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  }
}
