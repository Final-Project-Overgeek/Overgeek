const request = require('supertest');
const app = require('../app');
const { User } = require('../models');
const { generateToken } = require('../helpers/jwt');
let token = '';

beforeAll((done) => {
  User.findOne({ where: { role: 'admin' }})
  .then((data) => {
    token = generateToken(data.dataValues)
    done();
  })
  .catch(err => done(err))
})

describe('testing /subscriptions', () => {
  describe('should return status 201 with newly created data', (done) => {
    const body = {
      name: 'Thor',
      image: 'www.google.co.id',
      price: 12000,
      days: 5
    }
    request(app)
      .post('/subscriptions')
      .set('access_token', token)
      .send(body)
      .end((err, res) => {
        expect(res.body).toEqual(201)
        done()
      })
  })
})