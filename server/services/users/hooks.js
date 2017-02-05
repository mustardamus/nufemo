/* global Hooks */

require('dotenv').load()

const userRolesDefault = process.env.USER_ROLES_DEFAULT.split(',')
const superAdminUsernames = process.env.SUPER_ADMIN_USERNAMES.split(',')
const superAdminRole = process.env.SUPER_ADMIN_ROLE

const makeSuperAdmin = (hook) => {
  return new Promise((resolve, reject) => {
    if (superAdminUsernames.includes(hook.data.username)) {
      userRolesDefault.push(superAdminRole)
      hook.data.roles = userRolesDefault
    }

    resolve(hook)
  })
}

module.exports = {
  before: {
    all: [],
    find: [
      Hooks.authentication.verifyToken(),
      Hooks.authentication.populateUser(),
      Hooks.authentication.restrictToAuthenticated(),
      Hooks.authentication.restrictToRoles({
        roles: [superAdminRole],
        ownerField: '_id'
      })
    ],
    get: [
      Hooks.authentication.verifyToken(),
      Hooks.authentication.populateUser(),
      Hooks.authentication.restrictToRoles({
        roles: [superAdminRole],
        ownerField: '_id',
        owner: true
      })
    ],
    create: [
      Hooks.authentication.hashPassword(),
      makeSuperAdmin
    ],
    update: [],
    patch: [],
    remove: []
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
