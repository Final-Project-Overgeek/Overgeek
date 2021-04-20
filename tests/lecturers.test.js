const request = require('supertest');
const app = require('../app');
const { User, Lecturer, Rating } = require('../models');
const { generateToken } = require('../helpers/jwt');
let token = '';
const { sequelize } = require("../models")
const { queryInterface } = sequelize

let id;

beforeAll(async (done) => {
  queryInterface.bulkInsert('Lecturers', [{
    name: 'Mobile Legends Esport',
    profile: 'MOBA',
    game: 'mobile game',
    role: 'mistery',
    team: 'Hayabusa',
    language: 'english',
    image: "data/d872f5a0d69a4287bd9605b2ed5533e3",
    createdAt: new Date(),
    updatedAt: new Date()
  }], {})
  .then(() => {
    return User.findOne({ where: { role: 'admin' }})
  })
  .then((data) => {
    token = generateToken(data.dataValues)
    done();
  })
  .catch(err => done(err))
  // try {
  //   queryInterface.bulkInsert('Lecturers', [
  //     {
  //       name: 'Mobile Legends Esport',
  //       profile: 'MOBA',
  //       game: 'mobile game',
  //       role: 'mistery',
  //       team: 'Hayabusa',
  //       language: 'english',
  //       image: "data/d872f5a0d69a4287bd9605b2ed5533e3",
  //       createdAt: new Date(),
  //       updatedAt: new Date()
  //     }
  //   ], {})
  //   done()
  // } catch (error) {
  //   done(error)
  // }
})

// afterAll((done) => {
//   queryInterface.bulkDelete('Lecturers')
//   .then(() => {
//     // console.log('All database restored')
//     return done()
//   })
//   .catch(err => done(err))
// })

describe('testing /lecturers', () => {
  beforeAll(async (done) => {
    try {
      Lecturer.findAll()
      .then(data => {
        id = data[0].dataValues.id
        done()
      })
    } catch (error) {
      done(err)
    }
 })
  // afterAll((done) => {
  //   Lecturer.destroy({ where: {} })
  //   .then(() => done())
  //   .catch(done)
  // })

  /* ======================= CREATE LECTURERS ======================= */

  describe('success POST /lecturers', () => {
    it('should return response with status 201', async (done) => {
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
          if (err) {done(err)}
            expect(res.statusCode).toEqual(201)
            done()
        }, 5000)
    })
  })

  describe('POST, /lecturers', function() {
    it('should return status 201 with newly created data', function(done) {
      const body = {
        name: 'Mobile Legends',
        profile: 'MOBA',
        game: 'mobile game',
        role: 'mistery',
        team: 'Hayabusa',
        language: 'english',
        image: "data/d872f5a0d69a4287bd9605b2ed5533e3",
        ratings: [5, 4, 2]
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
            expect(typeof res.body.id).toEqual('number')
            expect(res.body.name).toEqual(body.name)
            expect(res.body.profile).toEqual(body.profile)
            expect(res.body.game).toEqual(body.game)
            expect(res.body.role).toEqual(body.role)
            expect(res.body.team).toEqual(body.team)
            expect(res.body.language).toEqual(body.language)
            expect(res.body.image).toEqual(body.image)
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
        .put('/lecturers/' + id)
        .set('access_token', token)
        .send(body)
        .end((err, res) => {
          if (err) done(err)
          else {
            expect(res.statusCode).toEqual(200);
            // console.log(res.body);
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
        .put('/lecturers/' + id)
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
        .put('/lecturers/' + id)
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
        .put('/lecturers/' + id)
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
    it('should return response when lecturer id is not found', (done) => {
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
        .put('/lecturers/999')
        .set('access_token', token)
        .send(body)
        .end((err, res) => {
          if (err) done(err)
          else {
            expect(res.statusCode).toEqual(404)
            done()
          }
        })
    })
  })

   // /* ======================= READ LECTURERS ======================= */
   
   describe('testing READ /Lecturers', () => {
      beforeAll((done) => {
      const ratingData = {
        rating: 5,
        UserId: 2,
        LecturerId: id
      }
      Rating.create(ratingData)
      .then(() => {
        done()
      })
      })
      const body = {
        id: 10,
        name: "Pokka",
        profile: "Ex Pro Player, currently coaching LOL Wildrift divisions of Onic Esports",
        game: "League of Legends: Wild Rift",
        role: "Coach",
        team: "Onic Esports",
        language: "Indonesia",
        image: "https://asset-a.grid.id/crop/0x0:0x0/700x0/photo/2020/06/01/3809461670.jpg",
        rating: 5,
     }
     it('should return success where status code 200', (done) => {
       request(app)
        .get('/lecturers')
        .send(body)
        .end((err, res) => {
          if (err) done(err)
          else {
            // console.log(res.body, '<<<<<<<<<<< HGDHD');
            expect(res.statusCode).toEqual(200)
            // for(let i = 0; i < res.body.length; i++) {
            //   expect(res.body[i].name).toEqual(body.name)
            //   expect(res.body[i].profile).toEqual(body.profile)
            //   expect(res.body[i].game).toEqual(body.game)
            //   expect(res.body[i].role).toEqual(body.role)
            //   expect(res.body[i].team).toEqual(body.team)
            //   expect(res.body[i].language).toEqual(body.language)
            //   expect(res.body[i].image).toEqual(body.image)
            // }
            done()
          }
        })
     })
     it('should return success where status code 200', (done) => {
      request(app)
       .get('/lecturers/' + id)
       .send(body)
       .end((err, res) => {
         if (err) done(err)
         else {
           // console.log(res.body, '<<<<<<<<<<< HGDHD');
           expect(res.statusCode).toEqual(200)
           // for(let i = 0; i < res.body.length; i++) {
           //   expect(res.body[i].name).toEqual(body.name)
           //   expect(res.body[i].profile).toEqual(body.profile)
           //   expect(res.body[i].game).toEqual(body.game)
           //   expect(res.body[i].role).toEqual(body.role)
           //   expect(res.body[i].team).toEqual(body.team)
           //   expect(res.body[i].language).toEqual(body.language)
           //   expect(res.body[i].image).toEqual(body.image)
           // }
           done()
         }
        })
      })
      it('should return success where status code 200', (done) => {
        request(app)
         .get('/lecturers/99')
         .send(body)
         .end((err, res) => {
           if (err) done(err)
           else {
             // console.log(res.body, '<<<<<<<<<<< HGDHD');
             expect(res.statusCode).toEqual(404)
             // for(let i = 0; i < res.body.length; i++) {
             //   expect(res.body[i].name).toEqual(body.name)
             //   expect(res.body[i].profile).toEqual(body.profile)
             //   expect(res.body[i].game).toEqual(body.game)
             //   expect(res.body[i].role).toEqual(body.role)
             //   expect(res.body[i].team).toEqual(body.team)
             //   expect(res.body[i].language).toEqual(body.language)
             //   expect(res.body[i].image).toEqual(body.image)
             // }
             done()
           }
         })
      })
  })
  
  /* ======================= DELETE LECTURERS ======================= */

  describe('testing delete /lecturers', () => {
    it('should return response with status 200', (done) => {
      request(app)
        .delete(`/lecturers/${id}`)
        .set('access_token', token)
        .end((err, res) => {
          if (err) done(err)
          else {
            expect(res.statusCode).toEqual(200)
            done()
          }
        })
    })

    it('should return response when id is not found', (done) => {
      request(app)
        .delete(`/lecturers/999`)
        .set('access_token', token)
        .end((err, res) => {
          if (err) done(err)
          else {
            expect(res.statusCode).toEqual(404)
            done()
          }
        })
    })
  })

  /* ======================= READ GAMES ======================= */

  describe('success GET /games', () => {
    it('should return status code 200', (done) => {
      const body = {
        id: 12,
        name: "Radians",
        profile: "LOL Wildrift player of MBR Esports",
        game: "League of Legends: Wild Rift",
        role: "Midlaner",
        team: "MBR Esports",
        language: "Indonesia",
        image: "https://i.ytimg.com/vi/VPk1VCE6Un4/maxresdefault.jpg",
        rating: 5,
        videos: []
      }
      request(app)
        .get('/lecturers?/game=Mobile Legends')
        .send(body)
        .end((err, res) => {
          if (err) done(err)
          else {
            expect(res.statusCode).toEqual(200)
            done()
          }
        })
    })
  })
})