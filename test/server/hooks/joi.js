/* globals describe, it */

const Joi = global.Joi = require('joi')
const chai = require('chai')
const hook = require('../../../server/hooks/joi')

const assert = chai.assert

const schema = {
  username: Joi.string().required(),
  password: Joi.string().min(8).required()
}

describe('removeFields before hook', () => {
  it('should be a function', () => {
    assert.isFunction(hook)
  })

  it('should return a function', () => {
    assert.isFunction(hook('field'))
  })

  it('should return a promise', () => {
    assert.isOk(hook({})({}) instanceof Promise)
  })

  it('should validate hook.data with a schema', () => {
    const hookObj = {
      data: {
        username: 'test',
        password: '12345678'
      }
    }

    return hook(schema)(hookObj)
    .then(hook => {
      assert.isOk(hook)
      assert.deepEqual(hookObj.data, hook.data)
    })
  })

  it('should invalidate hook.data with a schema, abort on first error', () => {
    const hookObj = {
      data: {
        username: 'test non alpha $num',
        password: '1'
      }
    }

    return hook(schema)(hookObj)
    .catch(err => assert.isOk(err))
  })
})
