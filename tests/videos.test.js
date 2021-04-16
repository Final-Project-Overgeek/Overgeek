const request = require('supertest');
const app = require('../app');
const token = '123456789'

describe('testing /courses', () => {
  describe('success POST /courses', () => {
    it('should return response with status', (done) => {
      const body = {
        title: 'hello world',
        url: 'https://google.co.id',
        thumbnail: 'acak',
        isFree: false
      }
      request(app)
        .post('/courses')
        .set('access_token', token)
        .send(body)
        .end((err, res) => {
          if (err) done(err)
          else {
            expect(res.statusCode).toEqual(201)
            expect(typeof res.body).toEqual('object');
            // expect(res.body.product).toHaveProperty("title", body.title);
            done()
          }
        })
    })
  })

  describe('POST /courses failed', () => {
    it('should return response when access token is empty', (done) => {
      const body = {
        title: 'hello world',
        url: 'https://google.co.id',
        thumbnail: 'acak',
        isFree: false
      }
      request(app)
        .post('/courses')
        .set('')
        .send(body)
        .end((err, res) => {
          if (err) done(err)
          else {
            expect(res.statusCode).toEqual(401);
            expect(typeof res.body).toEqual('object');
            expect(res.body).toHaveProperty("message", "jwt must be provided")
            done()
          }
        })
    })
    it('should return response when title is empty', (done) => {
      const body = {
        title: '',
        url: 'https://google.co.id',
        thumbnail: 'acak',
        isFree: false
      }
      request(app)
        .post('/courses')
        .set('access_token', token)
        .send(body)
        .end((err, res) => {
          if (err) done(err)
          else {
            expect(res.statusCode).toEqual(400);
            expect(typeof res.body).toEqual('object');
            // expect(res.body).toHaveProperty("message", "please input title")
            done()
          }
        })
    })
    it('should return response when url is empty', (done) => {
      const body = {
        title: 'hello world',
        url: '',
        thumbnail: 'acak',
        isFree: false
      }
      request(app)
        .post('/courses')
        .set('access_token', token)
        .send(body)
        .end((err, res) => {
          if (err) done(err)
          else {
            expect(res.statusCode).toEqual(400);
            expect(typeof res.body).toEqual('object');
            // expect(res.body).toHaveProperty("message", "please input title")
            done()
          }
        })
    })
  })
})