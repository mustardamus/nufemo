/* globals describe, it */

const _ = global._ = require('lodash')
const chai = require('chai')
const hook = require('../../../server/hooks/remove-fields')

const assert = chai.assert

const hookObj = {
  result: {
    username: 'username',
    email: 'email',
    password: 'password',
    token: 'token'
  }
}

describe('removeFields before hook', () => {
  it('should be a function', () => {
    assert.isFunction(hook)
  })

  it('should return a function', () => {
    assert.isFunction(hook('field'))
  })

  it('should return a promise', () => {
    assert.isOk(hook('field')(hookObj) instanceof Promise)
  })

  it('should remove one field', () => {
    let clonedObj = _.clone(hookObj.result)
    _.unset(clonedObj, 'password')

    return hook('password')(hookObj)
    .then(hook => {
      assert.deepEqual(hook.result, clonedObj)
    })
  })

  it('should remove multiple fields', () => {
    let clonedObj = _.clone(hookObj.result)
    _.unset(clonedObj, 'password')
    _.unset(clonedObj, 'token')

    return hook('password', 'token')(hookObj)
    .then(hook => {
      assert.deepEqual(hook.result, clonedObj)
    })
  })
})
