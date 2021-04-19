const request = require('supertest');
const app = require('../app');
const { User } = require('../models');
const { generateToken } = require('../helpers/jwt');
const deleteLecturer = require('../helpers/deleteLecturers');
let token = '';
const { sequelize } = require("../models")
const { queryInterface } = sequelize

beforeAll(async (done) => {
  try {
    // queryInterface.bulkInsert('Users', [
    //   {
    //     username: 'usernameadmin',
    //     email: 'username@mail.com',
    //     password: '123456',
    //     phone_number: '123456',
    //     premium: false,
    //     subscription_date: null,
    //     role: "admin",
    //     createdAt: new Date(),
    //     updatedAt: new Date()
    //   },
    //   {
    //     username: 'customer',
    //     email: 'customer@mail.com',
    //     password: '123456',
    //     phone_number: '123456',
    //     premium: false,
    //     subscription_date: null,
    //     role: "customer",
    //     createdAt: new Date(),
    //     updatedAt: new Date()
    //   }
    // ], {})
    queryInterface.bulkInsert('Lecturers', [
      {
        name: 'Mobile Legends Esport',
        profile: 'MOBA',
        game: 'mobile game',
        role: 'mistery',
        team: 'Hayabusa',
        language: 'english',
        image: "data/d872f5a0d69a4287bd9605b2ed5533e3",
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {})

    // let data = await User.findByPk(157)
    // console.log(data, '<<<<<< DATA');
    // let payload = { email: data.dataValues.email, id: data.dataValues.id }
    // token = generateToken(data)
    // let lecturer = await Lecturer.findOne({ where: { name: 'Mobile Legends' } })
    // id = lecturer.dataValues.id
    // console.log(id, '6^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^')
    done()
  } catch (error) {
    done(error)
  }
})

// afterAll((done) => {
//   queryInterface.bulkDelete('Users')
//     .then(() => {
//       return queryInterface.bulkDelete('Lecturers')
//     })
//     .then(() => {
//       console.log('All database restored')
//       return done()
//     })
//     .catch(err => done(err))
// })

beforeAll((done) => {
  User.findOne({ where: { role: 'admin' }})
  .then((data) => {
    // console.log(data);
    token = generateToken(data.dataValues)
    // console.log(token);
    done();
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

  describe('POST, /lecturers', function() {
    it('should return status 201 with newly created data', function(done) {
      const body = {
        name: 'Mobile Legends',
        profile: 'MOBA',
        game: 'mobile game',
        role: 'mistery',
        team: 'Hayabusa',
        language: 'english',
        image: "data/d872f5a0d69a4287bd9605b2ed5533e3"
      }
      request(app)
        .post('/lecturers')
        .set({ 'access_token': token, Accept: 'application/json' })
        .send(body)
        .end((err, res) => {
          if (err) {
            done(err)
          } else {
            expect(res.status).toEqual(201)
            expect(typeof res.body).toEqual('object')
            expect(res.body).toHaveProperty('id')
            expect(res.body).toHaveProperty('name')
            expect(res.body).toHaveProperty('profile')
            expect(res.body).toHaveProperty('game')
            expect(res.body).toHaveProperty('role')
            expect(res.body).toHaveProperty('team')
            expect(res.body).toHaveProperty('language')
            expect(res.body).toHaveProperty('image')
            expect(res.body).toHaveProperty('createdAt')
            expect(res.body).toHaveProperty('updatedAt')
            expect(typeof res.body.id).toEqual('number')
            expect(res.body.name).toEqual(body.name)
            expect(res.body.profile).toEqual(body.profile)
            expect(res.body.game).toEqual(body.game)
            expect(res.body.role).toEqual(body.role)
            expect(res.body.team).toEqual(body.team)
            expect(res.body.language).toEqual(body.language)
            expect(res.body.image).toEqual(body.image)
            expect(typeof res.body.createdAt).toEqual('string')
            expect(typeof res.body.updatedAt).toEqual('string')
            done()
          }
        })
    })
  })

  describe('POST /lecturers failed', () => {
    it('should return response when name is not inputted', (done) => {
      const body = {
        name: '',
        profile: 'MOBA',
        game: 'mobile game',
        role: 'mistery',
        team: ['Hayabusa', 'Lancelot'],
        language: 'english',
        image: 'www.google.co.id'
      }
      request(app)
        .post('/lecturers')
        .set('access_token', token)
        .send(body)
        .end((err, res) => {
          if (err) done(err)
          else {
            expect(res.statusCode).toEqual(400);
            expect(typeof res.body).toEqual('object');
            // expect(res.body).toHaveProperty
            done()
          }
        })
    })
    it('should return response when access token is not admin', (done) => {
      const body = {
        name: 'Mobile Legends',
        profile: 'MOBA',
        game: 'mobile game',
        role: 'mistery',
        team: ['Hayabusa', 'Lancelot'],
        language: 'english',
        image: 'www.google.co.id'
      }
      request(app)
        .post('/lecturers')
        .set('access_token', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6OCwiZW1haWwiOiJjdXN0b21lckBlbWFpbC5jb20iLCJ1c2VybmFtZSI6InVzZXJuYW1lMSIsInBob25lX251bWJlciI6IjA5ODA5ODk4Iiwic3Vic2NyaXB0aW9uX2RhdGUiOm51bGwsInJvbGUiOiJjdXN0b21lciIsImlhdCI6MTYxODgxOTE0NH0.UIfA0j4bGGN6Ji8WVLA9VPcrW2UcIuDMkrw3LIQ6dPI')
        .send(body)
        .end((err, res) => {
          if (err) done(err)
          else {
            expect(res.statusCode).toEqual(401)
            expect(res.body).toHaveProperty('message', "Invalid Token")
            done()
          }
        })
    })
    it('should return response when access_token is empty', (done) => {
      const body = {
        name: 'Mobile Legends',
        profile: 'MOBA',
        game: 'mobile game',
        role: 'mistery',
        team: ['Hayabusa', 'Lancelot'],
        language: 'english',
        image: 'www.google.co.id'
      }
      request(app)
        .post('/lecturers')
        
        .send(body)
        .end((err, res) => {
          if (err) done(err)
          else {
            expect(res.statusCode).toEqual(401)
            expect(res.body).toHaveProperty('message', 'Invalid Token!')
            done()
          }
        })
    })
  })

  // /* ======================= UPDATE LECTURERS ======================= */

  describe('success PUT /lecturers', () => {
    it('should return response with status code 200', (done) => {
      const body = {
        name: 'Mobile Legends',
        profile: 'MOBA',
        game: 'mobile game',
        role: 'mistery',
        team: 'Hayabusa',
        language: 'english',
        image: 'www.google.co.id'
      }
      request(app)
        .put('/lecturers/' + 105)
        .set('access_token', token)
        .send(body)
        .end((err, res) => {
          if (err) done(err)
          else {
            expect(res.statusCode).toEqual(200);
            console.log(res.body);
            expect(typeof res.body).toEqual('object');
            done()
          }
        })
    })
  })

  describe('PUT /lecturers failed', () => {
    it('should return response when access token is empty', (done) => {
      const body = {
        name: 'Mobile Legends Edited',
        profile: 'MOBA Edited',
        game: 'mobile game edited',
        role: 'mistery edited',
        team: ['Hayabusa', 'Lancelot', 'add new team'],
        language: 'english edited',
        image: 'www.google.co.id'
      }
      request(app)
        .put('/lecturers/1')
        .set('access_token', '')
        .send(body)
        .end((err, res) => {
          if (err) done(err)
          else {
            expect(res.statusCode).toEqual(401);
            expect(res.body).toHaveProperty('message', 'Invalid Token!')
            done()
          }
        })
    })
    it('should return response when access token is not admin', (done) => {
      const body = {
        name: 'Mobile Legends Edited',
        profile: 'MOBA Edited',
        game: 'mobile game edited',
        role: 'mistery edited',
        team: ['Hayabusa', 'Lancelot', 'add new team'],
        language: 'english edited',
        image: 'www.google.co.id'
      }
      request(app)
        .put('/lecturers/1')
        .set('access_token', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6OCwiZW1haWwiOiJjdXN0b21lckBlbWFpbC5jb20iLCJ1c2VybmFtZSI6InVzZXJuYW1lMSIsInBob25lX251bWJlciI6IjA5ODA5ODk4Iiwic3Vic2NyaXB0aW9uX2RhdGUiOm51bGwsInJvbGUiOiJjdXN0b21lciIsImlhdCI6MTYxODgxOTE0NH0.UIfA0j4bGGN6Ji8WVLA9VPcrW2UcIuDMkrw3LIQ6dPI')
        .send(body)
        .end((err, res) => {
          expect(res.statusCode).toEqual(401)
          expect(res.body).toHaveProperty('message', 'Invalid Token');
          done()
        })
    })
    it('should return response when name is empty', (done) => {
      const body = {
        name: '',
        profile: 'MOBA Edited',
        game: 'mobile game edited',
        role: 'mistery edited',
        team: ['Hayabusa', 'Lancelot', 'add new team'],
        language: 'english edited',
        image: 'www.google.co.id'
      }
      request(app)
        .put('/lecturers/106')
        .set('access_token', token)
        .send(body)
        .end((err, res) => {
          expect(res.statusCode).toEqual(400)
          expect(Array.isArray(res.body.errorMsg)).toEqual(true)
            expect(res.body.errorMsg).toEqual(
              expect.arrayContaining(["team cannot be an array or an object"])
            )
          done()
        })
    })
  })
})