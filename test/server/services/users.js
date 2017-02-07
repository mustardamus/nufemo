/* globals describe, it, before, after, Services */

require('dotenv').load()

const chai = require('chai')
const chaiHttp = require('chai-http')
const app = require('../../../server/app')

const assert = chai.assert

const userRolesDefault = process.env.USER_ROLES_DEFAULT.split(',')
const superAdminRole = process.env.SUPER_ADMIN_ROLE
const superAdminUsernames = process.env.SUPER_ADMIN_USERNAMES.split(',')
const localEndpoint = process.env.LOCAL_SERVICE_ENDPOINT
const tokenEndpoint = process.env.TOKEN_SERVICE_ENDPOINT
const usersEndpoint = `${process.env.API_PREFIX}/users`

const user1 = { username: 'u1', email: 'u1@test.com', password: '12345678' }
const user2 = { username: 'u2', email: 'u2@test.com', password: '12345678' }
const user3 = { username: 'u3', email: 'u3@test.com', password: '12345678' }
const superAdmin = {
  username: superAdminUsernames[0],
  email: 'u4@test.com',
  password: '12345678'
}
const ids = { user1: null, user2: null, user3: null, superAdmin: null }
const tokens = { user1: null, superAdmin: null }

chai.use(chaiHttp)

describe('User Service', () => {
  before(done => {
    this.server = app.listen(process.env.TEST_PORT)

    this.server.once('listening', () => {
      Services.Users.remove(null, () => {
        done()
      })
    })
  })

  after(done => {
    Services.Users.remove(null, () => {
      this.server.close(() => {
        done()
      })
    })
  })

  it('should exist globally', () => {
    assert.isOk(Services)
    assert.isOk(Services.Users)
  })

  it('should fail to create a user without username', done => {
    Services.Users.create({ password: '12345678', email: 'test@test.com' })
    .catch(err => {
      assert.isOk(err)
      done()
    })
  })

  it('should fail to create a user without a password', done => {
    Services.Users.create({ username: 'test', email: 'test@test.com' })
    .catch(err => {
      assert.isOk(err)
      done()
    })
  })

  it('should fail to create a user without a email', done => {
    Services.Users.create({ username: 'test', password: '12345678' })
    .catch(err => {
      assert.isOk(err)
      done()
    })
  })

  it('should fail to create a user with a non-aphanum username', done => {
    Services.Users.create({
      username: '$som e',
      email: 'test@test.com',
      password: '12345678'
    })
    .catch(err => {
      assert.isOk(err)
      done()
    })
  })

  it('should fail to create a user with a short password', done => {
    Services.Users.create({
      username: 'test',
      email: 'test@test.com',
      password: '1'
    })
    .catch(err => {
      assert.isOk(err)
      done()
    })
  })

  it('should fail to create a user with a invalid e-mail address', done => {
    Services.Users.create({
      username: 'test',
      email: 'not so valid',
      password: '12345678'
    })
    .catch(err => {
      assert.isOk(err)
      done()
    })
  })

  it('should successfully create a new user', done => {
    Services.Users.create(user1)
    .then(res => {
      assert.isOk(res)
      assert.isOk(res._id)
      assert.equal(res.username, user1.username)
      assert.equal(res.email, user1.email)

      ids.user1 = res._id
      done()
    })
  })

  it('should fails creating a user with same username', done => {
    Services.Users.create({
      username: user1,
      email: 'another@mail.com',
      password: '12345678'
    })
    .catch(err => {
      assert.isOk(err)
      done()
    })
  })

  it('should fails creating a user with same email', done => {
    Services.Users.create({
      username: 'another',
      email: user1.email,
      password: '12345678'
    })
    .catch(err => {
      assert.isOk(err)
      done()
    })
  })

  it('should not return the hashed password on creating a new user', done => {
    Services.Users.create(user2)
    .then(res => {
      assert.isOk(res)
      assert.isOk(res._id)
      assert.isNotOk(res.password)

      ids.user2 = res._id
      done()
    })
  })

  it('should set the default roles to a user', done => {
    Services.Users.create(user3)
    .then(res => {
      assert.isOk(res)
      assert.isArray(res.roles)
      assert.deepEqual(res.roles, userRolesDefault)

      ids.user3 = res._id
      done()
    })
  })

  it('should add the super-admin role on matching usernames', done => {
    Services.Users.create(superAdmin)
    .then(res => {
      const roles = userRolesDefault
      roles.push(superAdminRole)

      assert.isOk(res)
      assert.deepEqual(res.roles, roles)

      ids.superAdmin = res._id
      done()
    })
  })

  it('should fail logging in a user with wrong password', done => {
    chai.request(app)
    .post(localEndpoint)
    .set('Accept', 'application/json')
    .send({ username: user1.username, password: 'wrong' })
    .catch(err => {
      assert.isOk(err)
      done()
    })
  })

  it('should fail logging in a user with a wrong token', done => {
    chai.request(app)
    .post(tokenEndpoint)
    .set('Accept', 'application/json')
    .send({ token: 'wrong' })
    .catch(err => {
      assert.isOk(err)
      done()
    })
  })

  it('should succeed logging in a user with correct password', done => {
    // note that user1.password will be set to the hashed password when creating
    // the user
    chai.request(app)
    .post(localEndpoint)
    .set('Accept', 'application/json')
    .send({ username: user1.username, password: '12345678' })
    .then(res => {
      assert.isOk(res.body)
      assert.isOk(res.body.token)
      assert.equal(res.body.data.username, user1.username)

      tokens.user1 = res.body.token
      done()
    })
  })

  it('should succeed logging in a user with a token', done => {
    chai.request(app)
    .post(tokenEndpoint)
    .set('Accept', 'application/json')
    .send({ token: tokens.user1 })
    .then(res => {
      assert.isOk(res.body)
      assert.equal(res.body.token, tokens.user1)
      assert.equal(res.body.data.username, user1.username)

      done()
    })
  })

  it('should not allow to find users without logging in', done => {
    chai.request(app)
    .get(usersEndpoint)
    .set('Accept', 'application/json')
    .send().end((err, res) => {
      assert.isOk(err)
      assert.deepEqual(res.body, {})

      done()
    })
  })

  it('should not be able to find users without a super_admin role', done => {
    chai.request(app)
    .get(usersEndpoint)
    .set('Accept', 'application/json')
    .set('Authorization', `Bearer ${tokens.user1}`)
    .send().end((err, res) => {
      assert.isOk(err)
      assert.deepEqual(res.body, {})

      done()
    })
  })

  it('should be able to find users with a super admin role', done => {
    chai.request(app)
    .post(localEndpoint)
    .set('Accept', 'application/json')
    .send({ username: superAdmin.username, password: '12345678' })
    .then(res => {
      assert.isOk(res.body)
      assert.isOk(res.body.token)
      assert.equal(res.body.data.username, superAdmin.username)

      tokens.superAdmin = res.body.token

      chai.request(app)
      .get(usersEndpoint)
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${tokens.superAdmin}`)
      .send().end((err, res) => {
        assert.isNotOk(err)
        assert.isOk(res)
        assert.lengthOf(res.body.data, 4)
        assert.equal(res.body.total, '4')

        done()
      })
    })
  })

  it('should not be able to get data of another user', done => {
    chai.request(app)
    .get(`${usersEndpoint}/${ids.user2}`)
    .set('Accept', 'application/json')
    .set('Authorization', `Bearer ${tokens.user1}`)
    .send().end((err, res) => {
      assert.isOk(err)
      assert.deepEqual(res.body, {})

      done()
    })
  })

  it('should be able to get data of another user if super admin', done => {
    chai.request(app)
    .get(`${usersEndpoint}/${ids.user2}`)
    .set('Accept', 'application/json')
    .set('Authorization', `Bearer ${tokens.superAdmin}`)
    .send().end((err, res) => {
      assert.isNotOk(err)
      assert.isOk(res.body)
      assert.equal(res.body._id, ids.user2)
      assert.equal(res.body.username, user2.username)

      done()
    })
  })

  it('should be able to get data of own user', done => {
    chai.request(app)
    .get(`${usersEndpoint}/${ids.user1}`)
    .set('Accept', 'application/json')
    .set('Authorization', `Bearer ${tokens.user1}`)
    .send().end((err, res) => {
      assert.isNotOk(err)
      assert.equal(res.body._id, ids.user1)
      assert.equal(res.body.username, user1.username)

      done()
    })
  })

  it('should not be able to update data of another user', done => {
    chai.request(app)
    .put(`${usersEndpoint}/${ids.user2}`)
    .set('Accept', 'application/json')
    .set('Authorization', `Bearer ${tokens.user1}`)
    .send(user2).end((err, res) => {
      assert.isOk(err)
      assert.deepEqual(res.body, {})

      chai.request(app)
      .patch(`${usersEndpoint}/${ids.user2}`)
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${tokens.user1}`)
      .send({ email: 'some@other.com' }).end((err, res) => {
        assert.isOk(err)
        assert.deepEqual(res.body, {})

        done()
      })
    })
  })

  it('should be able to update data of own user', done => {
    chai.request(app)
    .put(`${usersEndpoint}/${ids.user1}`)
    .set('Accept', 'application/json')
    .set('Authorization', `Bearer ${tokens.user1}`)
    .send(user1).end((err, res) => {
      assert.isNotOk(err)
      assert.equal(res.body.email, user1.email)

      chai.request(app)
      .patch(`${usersEndpoint}/${ids.user1}`)
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${tokens.user1}`)
      .send({ email: user1.email }).end((err, res) => {
        assert.isNotOk(err)
        assert.equal(res.body.email, user1.email)

        done()
      })
    })
  })

  it('should be able to update data of another user as super admin', done => {
    chai.request(app)
    .put(`${usersEndpoint}/${ids.user2}`)
    .set('Accept', 'application/json')
    .set('Authorization', `Bearer ${tokens.superAdmin}`)
    .send(user2).end((err, res) => {
      assert.isNotOk(err)
      assert.equal(res.body.email, user2.email)

      chai.request(app)
      .patch(`${usersEndpoint}/${ids.user3}`)
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${tokens.superAdmin}`)
      .send({ email: user3.email }).end((err, res) => {
        assert.isNotOk(err)
        assert.equal(res.body.email, user3.email)

        done()
      })
    })
  })

  it('should not be able to delete another user')
})
