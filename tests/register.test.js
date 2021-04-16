const request = require('supertest');
const app = require('../app');

describe('testing /register', () => {
  describe('success POST /register success', () => {
    it('should return response with status code 200', (done) => {
      const body = {
        username: 'username',
        email: 'email@mail.com',
        password: 'email123',
        premium: false,
        phone_number: "12345678",
        subscription_data: '2020/12/20'
      }
      request(app)
        .post('/register')
        .send(body)
        .end((err, res) => {
          if (err) done(err)
          else {
            expect(res.statusCode).toEqual(200);
            expect(typeof res.body).toEqual('object');
            expect(res.body.username).toEqual(body.username);
            expect(res.body.email).toEqual(body.email);
            expect(res.body.password).toEqual(body.password);
            done()
          }
        })
    })
  })

  describe('POST /login failed', () => {
    it('should return response when email is not inputted', (done) => {
      const body = {
        username: 'username',
        email: '',
        password: 'email123',
        premium: false,
        phone_number: "12345678",
        subscription_data: '2020/12/20'
      }
      request(app)
        .post('/register')
        .send(body)
        .end((err, res) => {
          if (err) done(err)
          else {
            expect(res.statusCode).toEqual(400);
            expect(typeof res.body).toEqual('object');
            expect(res.body).toHaveProperty("message", "please input email or password");
            done()
          }
        })
    })
    it('should return response when password is not inputted', (done) => {
      const body = {
        username: 'username',
        email: 'email@mail.com',
        password: '',
        premium: false,
        phone_number: "12345678",
        subscription_data: '2020/12/20'
      }
      request(app)
        .post('/register')
        .send(body)
        .end((err, res) => {
          if (err) done(err)
          else {
            expect(res.statusCode).toEqual(400);
            expect(typeof res.body).toEqual('object');
            expect(res.body).toHaveProperty("message", "please input email or password");
            done()
          }
        })
    })
    it('should return response when username is not inputted', (done) => {
      const body = {
        username: '',
        email: 'email@mail.com',
        password: 'email123',
        premium: false,
        phone_number: "12345678",
        subscription_data: '2020/12/20'
      }
      request(app)
        .post('/register')
        .send(body)
        .end((err, res) => {
          if (err) done(err)
          else {
            expect(res.statusCode).toEqual(400);
            expect(typeof res.body).toEqual('object');
            expect(res.body).toHaveProperty("message", "please input username first");
            done()
          }
        })
    })
  })
})