const request = require('supertest');
const app = require('../app');
const deleteVideos = require('../helpers/deleteVideos');
const token = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwiZW1haWwiOiJlbWFpbEBtYWlsLm
              NvbSIsInVzZXJuYW1lIjoidXNlcm5hbWUiLCJwaG9uZV9udW1iZXIiOiIxMjM0NTY3OCIsInN1YnNjcmlwdGlvbl9k
              YXRlIjpudWxsLCJpYXQiOjE2MTg1NzI0MjZ9._VyIcKo8T-vApmFqKp7R71Fc-5Osv5UQmfhkWeocPhg`

describe('testing /courses', () => {
  beforeAll((done) => {
    deleteVideos()
    .then(() => done())
    .catch(done)
  })

  /* ======================= CREATE COURSES ======================= */

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

  // describe('POST /courses failed', () => {
  //   it('should return response when access token is empty', (done) => {
  //     const body = {
  //       title: 'hello world',
  //       url: 'https://google.co.id',
  //       thumbnail: 'acak',
  //       isFree: false
  //     }
  //     request(app)
  //       .post('/courses')
  //       .send(body)
  //       .end((err, res) => {
  //         if (err) done(err)
  //         else {
  //           expect(res.statusCode).toEqual(401);
  //           expect(typeof res.body).toEqual('object');
  //           expect(res.body).toHaveProperty("message", "jwt must be provided")
  //           done()
  //         }
  //       })
  //   })
  //   it('should return response when access token is wrong', (done) => {
  //     const body = {
  //       title: 'hello world',
  //       url: 'https://google.co.id',
  //       thumbnail: 'acak',
  //       isFree: false
  //     }
  //     request(app)
  //       .post('/courses')
  //       .set('access_token', 'wrong token')
  //       .send(body)
  //       .end((err, res) => {
  //         if (err) done(err)
  //         else {
  //           expect(res.statusCode).toEqual(401);
  //           expect(typeof res.body).toEqual('object');
  //           expect(res.body).toHaveProperty("message", "jwt malformed")
  //           done()
  //         }
  //       })
  //   })
  //   // it('should return response when title is empty', (done) => {
  //   //   const body = {
  //   //     title: '',
  //   //     url: 'https://google.co.id',
  //   //     thumbnail: 'acak',
  //   //     isFree: false
  //   //   }
  //   //   request(app)
  //   //     .post('/courses')
  //   //     .set('access_token', token)
  //   //     .send(body)
  //   //     .end((err, res) => {
  //   //       if (err) done(err)
  //   //       else {
  //   //         expect(res.statusCode).toEqual(400);
  //   //         expect(typeof res.body).toEqual('object');
  //   //         // expect(res.body).toHaveProperty("message", "please input title")
  //   //         done()
  //   //       }
  //   //     })
  //   // })
  //   // it('should return response when url is empty', (done) => {
  //   //   const body = {
  //   //     title: 'hello world',
  //   //     url: '',
  //   //     thumbnail: 'acak',
  //   //     isFree: false
  //   //   }
  //   //   request(app)
  //   //     .post('/courses')
  //   //     .set('access_token', token)
  //   //     .send(body)
  //   //     .end((err, res) => {
  //   //       if (err) done(err)
  //   //       else {
  //   //         expect(res.statusCode).toEqual(400);
  //   //         expect(typeof res.body).toEqual('object');
  //   //         // expect(res.body).toHaveProperty("message", "please input title")
  //   //         done()
  //   //       }
  //   //     })
  //   // })
  // })

  // /* ======================= READ COURSES ======================= */

  // describe('success READ /courses', () => {
  //   it('should return response with status code 200', (done) => {
  //     request(app)
  //       .get('/courses')
  //       .set('access_token', token)
  //       .end((err, res) => {
  //         if (err) done(err)
  //         else {
  //           expect(res.statusCode).toEqual(200)
  //           expect(typeof res.body).toEqual('object');
  //           done()
  //         }
  //       })
  //   })
  // })

  // /* ======================= UPDATE COURSES ======================= */

  // describe('success PUT /courses', () => {
  //   it('should return response with status code 200', (done) => {
  //     const body = {
  //       title: 'edited videos',
  //       url: 'https://google.co.id',
  //       thumbnail: 'acak',
  //       isFree: false
  //     }
  //     request(app)
  //       .put('/courses/1')
  //       .set('access_token', token)
  //       .send(body)
  //       .end((err, res) => {
  //         if (err) done(err)
  //         else {
  //           expect(res.statusCode).toEqual(200)
  //           expect(typeof res.body).toEqual('object');
  //           done()
  //         }
  //       })
  //   })
  // })

  // describe('PUT /courses failed', () => {
  //   it('should return response when access token is empty', (done) => {
  //     const body = {
  //       title: 'edited videos',
  //       url: 'https://google.co.id',
  //       thumbnail: 'acak',
  //       isFree: false
  //     }
  //     request(app)
  //       .put('/courses/1')
  //       .send(body)
  //       .end((err, res) => {
  //         if (err) done(err)
  //         else {
  //           expect(res.statusCode).toEqual(400);
  //           expect(typeof res.body).toEqual('object');
  //           expect(res.body).toHaveProperty('mesage', 'jwt must be provided')
  //         }
  //       })
  //   })
  // })

  // /* ======================= DELETE COURSES ======================= */

  // describe('success DELETE /courses', () => {
  //   it('should return response with status 200', (done) => {
  //     request(app)
  //       .delete('/courses/1')
  //       .set('access_token', token)
  //       .send(body)
  //       .end((err, res) => {
  //         if (err) done(err)
  //         else {
  //           expect(res.statusCode).toEqual(200)
  //           done()
  //         }
  //       })
  //   })
  // })

  // describe('DELETE /courses failed', () => {
  //   it('should return response with status 401', (done) => {
  //     request(app)
  //       .delete('/courses/99')
  //       .set('access_token', token)
  //       .send(body)
  //       .end((err, res) => {
  //         if (err) done(err)
  //         else {
  //           expect(res.statusCode).toEqual(401)
  //           done()
  //         }
  //       })
  //   })
  // })
})