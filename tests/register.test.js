const request = require('supertest');
const app = require('../app');
const deleteUser = require('../helpers/deleteUser');

describe('testing /register', () => {
  beforeAll((done) => {
    deleteUser()
    .then(() => done())
    .catch(done)
  })

  /* ===================== CREATE USER ===================== */

  describe('success POST /register success', () => {
    it('should return response with status code 201', (done) => {
      const body = {
        username: 'email',
        email: 'email@mail.com',
        password: 'email',
        phone_number: "12345678",
        role: 'admin'
      }
      request(app)
        .post('/register')
        .send(body)
        .end((err, res) => {
          if (err) done(err)
          else {
            expect(res.statusCode).toEqual(201);
            expect(typeof res.body).toEqual('object');
            expect(res.body.username).toEqual(body.username);
            expect(res.body.email).toEqual(body.email);
            done()
          }
        })
    })
  })

  describe('POST /register failed', () => {
    it('should return response when email is not inputted', (done) => {
      const body = {
        username: 'username',
        email: '',
        password: 'email123',
        phone_number: "123456783"
      }
      request(app)
        .post('/register')
        .send(body)
        .end((err, res) => {
          if (err) done(err)
          else {
            expect(res.statusCode).toEqual(400);
            expect(typeof res.body).toEqual('object');
            expect(res.body).toHaveProperty("errorMsg", "Email cant be empty!", "Invalid Email format!");
            done()
          }
        })
    })
    it('should return response when password is not inputted', (done) => {
      const body = {
        username: 'username',
        email: 'email72@mail.com',
        password: '',
        phone_number: "12345678"
      }
      request(app)
        .post('/register')
        .send(body)
        .end((err, res) => {
          if (err) done(err)
          else {
            expect(res.statusCode).toEqual(400);
            expect(typeof res.body).toEqual('object');
            expect(res.body).toHaveProperty("errorMsg", "Password cant be empty!", "Minimum character for password is 4!");
            // expect(res.body).toHaveProperty("errorMsg", "Minimum character for password is 4!");
            done()
          }
        })
    })
    it('should return response when username is not inputted', (done) => {
      const body = {
        username: '',
        email: 'email@mail.com',
        password: 'email123',
        phone_number: "12345678"
      }
      request(app)
        .post('/register')
        .send(body)
        .end((err, res) => {
          if (err) done(err)
          else {
            expect(res.statusCode).toEqual(400);
            expect(typeof res.body).toEqual('object');
            expect(res.body).toHaveProperty("errorMsg");
            done()
          }
        })
    })
    it('should return response when email is more than one', (done) => {
      const body = {
        username: 'username',
        email: 'email@mail.com',
        password: 'email123',
        phone_number: "1234567899",
        role: 'admin'
      }
      request(app)
        .post('/register')
        .send(body)
        .end((err, res) => {
          if (err) done(err)
          else {
            expect(res.statusCode).toEqual(400);
            expect(typeof res.body).toEqual('object');
            expect(Array.isArray(res.body.errorMsg)).toEqual(true)
            expect(res.body.errorMsg).toEqual(
              expect.arrayContaining(["Email already exist!"])
            )
            done()
          }
        })
    })
    it('should return response when email format is wrong', (done) => {
      const body = {
        username: 'username',
        email: 'email',
        password: 'email123',
        phone_number: "1234567899"
      }
      request(app)
        .post('/register')
        .send(body)
        .end((err, res) => {
          if (err) done(err)
          else {
            expect(res.statusCode).toEqual(400);
            expect(typeof res.body).toEqual('object');
            // expect(res.body).toHaveProperty("errorMsg", "Invalid Email format!" );
            done()
          }
        })
    })
  })
})