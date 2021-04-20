const request = require('supertest');
const app = require('../app');
const { User, Lecturer, Rating } = require('../models');
const { generateToken } = require('../helpers/jwt');

let token = '';
let UserId;
let LecturerId;

describe('testing /rating', () => {
  beforeAll((done) => {
    User.findAll()
    .then(data => {
      UserId = data[0].dataValues.id
      done()
    })
  })
  beforeAll((done) => {
    Lecturer.findAll()
    .then(data => {
      LecturerId = data[0].dataValues.id
      done()
    })
  })
  beforeAll((done) => {
    User.findOne({ where: { role: 'admin' }})
    .then(data => {
      token = generateToken(data.dataValues)
      done()
    })
  })
  beforeAll((done) => {
    Rating.destroy({ where: {} })
    .then(() => done())
  })

  describe('success ADD /ratings', () => {
    it('should return with status code 201', (done) => {
      console.log(LecturerId, '<<<< LECT');
      console.log(UserId, '<<<<USER');
      const body = {
        rating: 3,
        UserId: UserId,
        LecturerId: LecturerId
      }
      request(app)
        .post('/ratings/' + LecturerId)
        .set('access_token', token)
        .send(body)
        .end((err, res) => {
          if (err) done(err)
          else {
            expect(res.statusCode).toEqual(201)
            expect(typeof res.body).toEqual('object')
            done()
          }
        })
    })
  })

  describe('ADD /ratings failed', () => {
    it('should return when rating input more than one', (done) => {
      console.log(token, '<<<< LECT');
      const body = {
        rating: 2,
        UserId: UserId,
        LecturerId: LecturerId
      }
      request(app)
        .post('/ratings/' + LecturerId)
        .set('access_token', token)
        .send(body)
        .end((err, res) => {
          if (err) done(err)
          else {
            expect(res.statusCode).toEqual(400)
            expect(typeof res.body).toEqual('object')
            done()
          }
        })
    })
  })
})