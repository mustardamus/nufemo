/* global Hooks, Joi */

require('dotenv').load()

const userRolesDefault = process.env.USER_ROLES_DEFAULT.split(',')
const superAdminUsernames = process.env.SUPER_ADMIN_USERNAMES.split(',')
const superAdminRole = process.env.SUPER_ADMIN_ROLE

const makeSuperAdmin = hook => {
  return new Promise((resolve, reject) => {
    if (superAdminUsernames.includes(hook.data.username)) {
      userRolesDefault.push(superAdminRole)
      hook.data.roles = userRolesDefault
    }

    resolve(hook)
  })
}

const ownerAndSuperAdmin = [
  Hooks.authentication.verifyToken(),
  Hooks.authentication.populateUser(),
  Hooks.authentication.restrictToAuthenticated(),
  Hooks.authentication.restrictToRoles({
    roles: [superAdminRole],
    ownerField: '_id',
    owner: true
  })
]

module.exports = {
  before: {
    all: [],
    find: [].concat(ownerAndSuperAdmin),
    get: [].concat(ownerAndSuperAdmin),
    create: [
      Hooks.joi({
        username: Joi.string().trim().alphanum().required(),
        password: Joi.string().trim().min(8).required(),
        email: Joi.string().trim().email().required()
      }),
      Hooks.authentication.hashPassword(),
      makeSuperAdmin
    ],
    update: [].concat(ownerAndSuperAdmin),
    patch: [].concat(ownerAndSuperAdmin),
    remove: [].concat(ownerAndSuperAdmin)
  },

  after: {
    all: [Hooks.removeFields('password', '__v')],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  }
}
