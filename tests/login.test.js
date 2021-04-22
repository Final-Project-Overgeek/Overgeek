const request = require('supertest');
const app = require('../app.js');
const { hashPassword } = require('../helpers/bcrypt');
const { sequelize } = require("../models");
const { queryInterface } = sequelize;

beforeAll(async (done) => {
  await queryInterface.bulkInsert('Users', [
    {
      id: 1,
      username: 'admin',
      email: 'admin@mail.com',
      password: hashPassword('12345'),
      phone_number: '08922777773',
      premium: false,
      subscription_date: null,
      role: "admin",
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 2,
      username: 'customer',
      email: 'customer@mail.com',
      password: hashPassword('12345'),
      phone_number: '08122339949',
      premium: false,
      subscription_date: null,
      role: "",
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ], {})
  done();
})

afterAll(async (done) => {
  await queryInterface.bulkDelete('Users')
  done();
})

describe('testing /login', () => {
  describe('success POST /login success', () => {
    it('should return response with status code 200', (done) => {
      const body = {
        email: "customer@mail.com",
        password: "12345"
      }
      request(app)
        .post('/login')
        .send(body)
        .end((err, res) => {
          if (err) done(err)
          else {
            expect(res.statusCode).toEqual(200);
            expect(typeof res.body).toEqual('object');
            expect(res.body.email).toEqual(body.username);
            expect(res.body.token).not.toBeNull();
            done()
          }
        })
    })
  })

  describe('POST /login failed', () => {
    it('should return response when nothing email in the database', (done) => {
      const body = {
        email: '',
        password: 'password'
      }
      request(app)
        .post('/login')
        .send(body)
        .end((err, res) => {
          if (err) done(err)
          else {
            expect(res.statusCode).toEqual(400);
            expect(typeof res.body).toEqual('object');
            expect(res.body).toHaveProperty("message", "Invalid email or password");
            done()
          }
        })
    })
    it('should return response when password is wrong', (done) => {
      const body = {
        email: 'email@mail.com',
        password: ''
      }
      request(app)
        .post('/login')
        .send(body)
        .end((err, res) => {
          if (err) done(err)
          else {
            expect(res.statusCode).toEqual(400);
            expect(typeof res.body).toEqual('object');
            expect(res.body).toHaveProperty("message", "Invalid email or password");
            done()
          }
        })
    })
    it('should return respone when email or password is empty', (done) => {
      const body = {
        email: '',
        password: ''
      }
      request(app)
        .post('/login')
        .send(body)
        .end((err, res) => {
          if (err) done(err)
          else {
            expect(res.statusCode).toEqual(400);
            expect(typeof res.body).toEqual('object');
            expect(res.body).toHaveProperty("message", "Invalid email or password");
            done()
          }
        })
    })
    it("shound return response when email or password have not registered", (done) => {
      const body = {
        email: 'trying@mail.com',
        password: 'uptoyou'
      }
      request(app)
        .post('/login')
        .send(body)
        .end((err, res) => {
          if (err) done(err)
          else {
            expect(res.statusCode).toEqual(400);
            expect(typeof res.body).toEqual('object');
            expect(res.body).toHaveProperty("message", "Invalid email or password");
            done()
          }
        })
    })
  })
})