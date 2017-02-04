/* globals describe, it, before, after, Services */

require('dotenv').load()

const chai = require('chai')
const chaiHttp = require('chai-http')
const app = require('../../../server/app')

const assert = chai.assert

const userRolesDefault = process.env.USER_ROLES_DEFAULT.split(',')
const superAdminRole = process.env.SUPER_ADMIN_ROLE
const superAdminUsernames = process.env.SUPER_ADMIN_USERNAMES.split(',')

const user1 = { username: 'u1', email: 'u1@test.com', password: '12345678' }
const user2 = { username: 'u2', email: 'u2@test.com', password: '12345678' }
const user3 = { username: 'u3', email: 'u3@test.com', password: '12345678' }
const superAdmin = {
  username: superAdminUsernames[0],
  email: 'u4@test.com',
  password: '12345678'
}

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

  it('should fail to create a user without username', () => {
    return Services.Users.create({ password: 'test', email: 'test@test.com' })
    .catch(err => {
      assert.isOk(err)
    })
  })

  it('should fail to create a user without a password', () => {
    return Services.Users.create({ username: 'test', email: 'test@test.com' })
    .catch(err => {
      assert.isOk(err)
    })
  })

  it('should fail to create a user without a email', () => {
    return Services.Users.create({ username: 'test', password: 'test' })
    .catch(err => {
      assert.isOk(err)
    })
  })

  it('should successfully create a new user', () => {
    return Services.Users.create(user1)
    .then(res => {
      assert.isOk(res)
      assert.isOk(res._id)
      assert.equal(res.username, user1.username)
      assert.equal(res.email, user1.email)
    })
  })

  it('should not return the hashed password on creating a new user', () => {
    return Services.Users.create(user2)
    .then(res => {
      assert.isOk(res)
      assert.isNotOk(res.password)
    })
  })

  it('should set the default roles to a user', () => {
    return Services.Users.create(user3)
    .then(res => {
      assert.isOk(res)
      assert.isArray(res.roles)
      assert.deepEqual(res.roles, userRolesDefault)
    })
  })

  it('should add the super-admin role on matching usernames', () => {
    return Services.Users.create(superAdmin)
    .then(res => {
      const roles = userRolesDefault
      roles.push(superAdminRole)

      assert.isOk(res)
      assert.deepEqual(res.roles, roles)
    })
  })
})

/*
const chai = require('chai');
const chaiHttp = require('chai-http');
const assert = require('assert');
const app = require('../../../src/app');
const Menu = app.service('menus');
const User = app.service('users');
const authentication = require('feathers-authentication/client');
const bodyParser = require('body-parser');
var token;
//config for app to do authentication
app
  .use(bodyParser.json())
  .use(bodyParser.urlencoded({ extended: true }))
  .configure(authentication());
//use http plugin
chai.use(chaiHttp);
//use should
var should = chai.should();

describe('menu service', () => {
  //setup
  before((done) => {
    //start the server
    this.server = app.listen(3030);
    //once listening do the following
    this.server.once('listening', () => {
      //create some mock menu items
      Menu.create({
        name: 'hamburger',
        price: 7.99,
        categories: ['lunch', 'burgers', 'dinner']
      });
      Menu.create({
        name: 'spinach omlete',
        price: 4.99,
        categories: ['breakfast', 'omlete']
      });
      Menu.create({
        name: 'steak',
        price: 12.99,
        categories: ['dinner', 'entree']
      });
      Menu.create({
        name: 'reuben',
        price: 6.99,
        categories: ['lunch', 'sandwhich']
      });
      Menu.create({
        name: 'soft drink',
        price: 1.99,
        categories: ['drinks', 'soda']
      });
      //create mock user
      User.create({
         'username': 'resposadmin',
         'password': 'igzSwi7*Creif4V$',
         'roles': ['admin']
      }, () => {
        //setup a request to get authentication token
        chai.request(app)
            //request to /auth/local
            .post('/auth/local')
            //set header
            .set('Accept', 'application/json')
            //send credentials
            .send({
               'username': 'resposadmin',
               'password': 'igzSwi7*Creif4V$'
            })
            //when finished
            .end((err, res) => {
              //set token for auth in other requests
              token = res.body.token;
              done();
            });
      });

    });
  });
  //teardown after tests
  after((done) => {
    //delete contents of menu in mongodb
    Menu.remove(null, () => {
      User.remove(null, () => {
        //stop the server
        this.server.close(function() {});
        done();
      });
    });

  });
  it('registered the menus service', () => {
    assert.ok(app.service('menus'));
  });
  it('should post the menuitem data', function(done) {
      //setup a request
      chai.request(app)
          //request to /store
          .post('/menus')
          .set('Accept', 'application/json')
          .set('Authorization', 'Bearer '.concat(token))
          //attach data to request
          .send({
              name: 'shrimp fettuccine',
              price: 12.99,
              categories: 'dinner, pasta'
          })
          //when finished do the following
          .end((err, res) => {
              res.body.should.have.property('name');
              res.body.name.should.equal('shrimp fettuccine');
              res.body.should.have.property('price');
              res.body.price.should.equal(12.99);
              res.body.categories.should.be.an('array')
                  .to.include.members(['dinner, pasta']);
              done();
          });
  });
});
*/
