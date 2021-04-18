const request = require('supertest');
const app = require('../app');
const { User } = require('../models');
const { generateToken } = require('../helpers/jwt');
const deleteLecturer = require('../helpers/deleteLecturers');
let token = ''

beforeAll((done) => {
  User.findOne({ where: { role: 'admin' }})
  .then((data) => {
    token = generateToken({
      id: data.dataValues.id,
      email: data.dataValues.email,
      username: data.dataValues.username,
      phone_number: data.dataValues.phone_number,
      subscription_date: data.dataValues.subscription_date,
      role: data.dataValues.role
    })
  })
  .catch(err => done(err))
})

describe('testing /lecturers', () => {
  // beforeAll((done) => {
  //   deleteLecturer()
  //   .then(() => done())
  //   .catch(done)
  // })

  /* ======================= CREATE LECTURERS ======================= */

  // describe('success POST /lecturers', () => {
  //   it('should return response with status 201', async (done) => {
  //     const body = {
  //       name: 'Mobile Legends',
  //       profile: 'MOBA',
  //       game: 'mobile game',
  //       role: 'mistery',
  //       team: 'Hayabusa',
  //       language: 'english',
  //       image: 'image'
  //     }
  //     request(app)
  //       .post('/lecturers')
  //       .set('access_token', token)
  //       .send(body)
  //       .end((err, res) => {
  //         if (err) {done(err)}
  //           expect(res.statusCode).toEqual(201)
  //           done()
  //       }, 5000)
  //   })
  // })

  describe('POST, /lecturers', () => {
    it.only('should return status 201 with newly created data', (done) => {
      const body = {
        name: 'Mobile Legends',
        profile: 'MOBA',
        game: 'mobile game',
        role: 'mistery',
        team: 'Hayabusa',
        language: 'english',
        image: 'image'
      }
      request(app)
        .post('/lecturers')
        .set('access_token', token)
        .send(body)
        .end((err, res) => {
          if (err) {
            done(err)
          } else {
            expect(res.status).toEqual(201)
            // expect(typeof res.body).toEqual('object')
            // expect(res.body).toHaveProperty('id')
            // expect(res.body).toHaveProperty('name')
            // expect(res.body).toHaveProperty('profile')
            // expect(res.body).toHaveProperty('game')
            // expect(res.body).toHaveProperty('role')
            // expect(res.body).toHaveProperty('team')
            // expect(res.body).toHaveProperty('language')
            // expect(res.body).toHaveProperty('image')
            // expect(res.body).toHaveProperty('createdAt')
            // expect(res.body).toHaveProperty('updatedAt')
            // expect(typeof res.body.id).toEqual('number')
            // expect(res.body.name).toEqual(body.name)
            // expect(res.body.profile).toEqual(body.profile)
            // expect(res.body.game).toEqual(body.game)
            // expect(res.body.role).toEqual(body.role)
            // expect(res.body.team).toEqual(body.team)
            // expect(res.body.language).toEqual(body.language)
            // expect(res.body.image).toEqual(body.image)
            // expect(typeof res.body.createdAt).toEqual('string')
            // expect(typeof res.body.updatedAt).toEqual('string')
            done()
          }
        })
    })
  })

  // describe('POST /lecturers failed', () => {
  //   it('should return response when name is not inputted', (done) => {
  //     const body = {
  //       name: '',
  //       profile: 'MOBA',
  //       game: 'mobile game',
  //       role: 'mistery',
  //       team: ['Hayabusa', 'Lancelot'],
  //       language: 'english',
  //       image: 'www.google.co.id'
  //     }
  //     request(app)
  //       .post('/lecturers')
  //       .set('access_token', token)
  //       .send(body)
  //       .end((err, res) => {
  //         if (err) done(err)
  //         else {
  //           expect(res.statusCode).toEqual(400);
  //           expect(typeof res.body).toEqual('object');
  //           // expect(res.body).toHaveProperty
  //           done()
  //         }
  //       })
  //   })
  //   it('should return response when access token is not admin', (done) => {
  //     const body = {
  //       name: 'Mobile Legends',
  //       profile: 'MOBA',
  //       game: 'mobile game',
  //       role: 'mistery',
  //       team: ['Hayabusa', 'Lancelot'],
  //       language: 'english',
  //       image: 'www.google.co.id'
  //     }
  //     request(app)
  //       .post('/lecturers')
  //       .set('access_token', 'wrong_token')
  //       .send(body)
  //       .end((err, res) => {
  //         if (err) done(err)
  //         else {
  //           expect(res.statusCode).toEqual(401)
  //           expect(res.body).toHaveProperty('message', 'jwt malformed')
  //           done()
  //         }
  //       })
  //   })
  //   it('should return response when invalid access token', (done) => {
  //     const body = {
  //       name: 'Mobile Legends',
  //       profile: 'MOBA',
  //       game: 'mobile game',
  //       role: 'mistery',
  //       team: ['Hayabusa', 'Lancelot'],
  //       language: 'english',
  //       image: 'www.google.co.id'
  //     }
  //     request(app)
  //       .post('/lecturers')
  //       .send(body)
  //       .end((err, res) => {
  //         if (err) done(err)
  //         else {
  //           expect(res.statusCode).toEqual(401)
  //           expect(res.body).toHaveProperty('message', 'jwt must be provided')
  //           done()
  //         }
  //       })
  //   })
  // })

  // /* ======================= UPATE LECTURERS ======================= */

  // describe('success PUT /lecturers', () => {
  //   it('should return response with status code 200', (done) => {
  //     const body = {
  //       name: 'Mobile Legends Edited',
  //       profile: 'MOBA Edited',
  //       game: 'mobile game edited',
  //       role: 'mistery edited',
  //       team: ['Hayabusa', 'Lancelot', 'add new team'],
  //       language: 'english edited',
  //       image: 'www.google.co.id'
  //     }
  //     request(app)
  //       .put('/lecturers/1')
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

  // describe('PUT /lecturers failed', () => {
  //   it('should return response when access token is empty', (done) => {
  //     const body = {
  //       name: 'Mobile Legends Edited',
  //       profile: 'MOBA Edited',
  //       game: 'mobile game edited',
  //       role: 'mistery edited',
  //       team: ['Hayabusa', 'Lancelot', 'add new team'],
  //       language: 'english edited',
  //       image: 'www.google.co.id'
  //     }
  //     request(app)
  //       .put('/lecturers/1')
  //       .send(body)
  //       .end((err, res) => {
  //         if (err) done(err)
  //         else {
  //           expect(res.statusCode).toEqual(401);
  //           expect(res.body).toHaveProperty('message', 'jwt must be provided')
  //           done()
  //         }
  //       })
  //   })
  //   it('should return response when access token is not admin', (done) => {
  //     const body = {
  //       name: 'Mobile Legends Edited',
  //       profile: 'MOBA Edited',
  //       game: 'mobile game edited',
  //       role: 'mistery edited',
  //       team: ['Hayabusa', 'Lancelot', 'add new team'],
  //       language: 'english edited',
  //       image: 'www.google.co.id'
  //     }
  //     request(app)
  //       .put('/lecturers/1')
  //       .set('access_token', 'customer')
  //       .send(body)
  //       .end((err, res) => {
  //         expect(res.statusCode).toEqual(401)
  //         expect(res.body).toHaveProperty('message', 'jwt malformed');
  //         done()
  //       })
  //   })
  //   it('should return response when name is empty', (done) => {
  //     const body = {
  //       name: '',
  //       profile: 'MOBA Edited',
  //       game: 'mobile game edited',
  //       role: 'mistery edited',
  //       team: ['Hayabusa', 'Lancelot', 'add new team'],
  //       language: 'english edited',
  //       image: 'www.google.co.id'
  //     }
  //     request(app)
  //       .put('/lecturers/1')
  //       .set('access_token', token)
  //       .send(body)
  //       .end((err, res) => {
  //         expect(res.statusCode).toEqual(401)
  //         // expect(res.body).toHaveProperty('message', 'jwt malformed');
  //         done()
  //       })
  //   })
  // })
  // describe('READ /lecturers failed', () => {
  //     it('should return response when name is not inputted', (done) => {
  //       // const body = {
  //       //   name: 'mobile legend',
  //       //   profile: 'MOBA',
  //       //   game: 'mobile game',
  //       //   role: 'mistery',
  //       //   team: ['Hayabusa', 'Lancelot'],
  //       //   language: 'english',
  //       //   image: 'www.google.co.id'
  //       // }
  //       request(app)
  //         .get('/lecturers')
  //         // .set('access_token', token)
  //         .send(body)
  //         .end((err, res) => {
  //           if (err) done(err)
  //           else {
  //             expect(res.statusCode).toEqual(400);
  //             expect(typeof res.body).toEqual('object');
  //             // expect(res.body).toHaveProperty
  //             done()
  //           }
  //         })
  //     })
  // })
})