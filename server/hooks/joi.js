const Joi = require('joi')

module.exports = (fields) => {
  return (hook) => {
    return new Promise((resolve, reject) => {
      const opt = { abortEarly: true }
      const schema = Joi.object().keys(fields)

      Joi.validate(hook.data, schema, opt, (err, value) => {
        if (err) {
          reject(err.details[0])
        } else {
          resolve(hook)
        }
      })
    })
  }
}
