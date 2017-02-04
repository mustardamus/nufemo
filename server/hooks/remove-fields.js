// feathers-hooks-common.remove does currently not work properly
// with feathers-mongoose. So recreate this hook.

/* globals _ */

const unsetFields = (fields, obj) => {
  fields.forEach(field => _.unset(obj, field))
}

module.exports = (...fields) => {
  return (hook) => {
    return new Promise((resolve, reject) => {
      if (_.isArray(hook.result)) {
        hook.result.forEach(item => {
          unsetFields(fields, item)
        })
      } else {
        unsetFields(fields, hook.result)
      }

      resolve(hook)
    })
  }
}
