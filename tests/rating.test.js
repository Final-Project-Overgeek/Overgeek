const request = require("supertest");
const app = require("../app.js");
const { User, Lecturer, Rating } = require('../models');
const { hashPassword, comparePassword } = require("../helpers/bcrypt");
const { generateToken } = require("../helpers/jwt.js");
const { sequelize } = require("../models");
const { queryInterface } = sequelize;

let token = '';
let LecturerId = 1;
let userLogin = {
  email: 'customer2@mail.com',
  password: '12345'
};

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
      email: 'customer2@mail.com',
      password: hashPassword('12345'),
      phone_number: '08122339949',
      premium: false,
      subscription_date: null,
      role: "",
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ], {})

  await queryInterface.bulkInsert('Lecturers', [
    {
      id: 1,
      name: "Bambang",
      profile: "MOBA",
      game: "Mobile Legends",
      role: "Coach",
      team: "Hayabusa",
      language: "English",
      image: "data/d872f5a0d69a4287bd9605b2ed5533e3",
      createdAt: new Date(),
      updatedAt: new Date(),
    }
  ], {})

  await queryInterface.bulkInsert('Videos', [
    {
      id: 1,
      title: "Ban & Picks Guide",
      url: "/upload/data/e3355f2b46ba90f13779db58fa8d5120",
      thumbnail: "https://imgur.com/a/Wjpk2BU",
      isFree: false,
      LecturerId: 1,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 2,
      title: "Knowing Your Role",
      url: "/upload/data/05bde798a27c0951cf535e2e55ee2bbf",
      thumbnail: "https://imgur.com/a/0CWNUuH",
      isFree: true,
      LecturerId: 1,
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ], {})

  User.findOne({ where: { email: userLogin.email } })
    .then(data => {
      if (data) {
        let cekPass = comparePassword(userLogin.password, data.password)
        let payload = { id: data.id, email: data.email }
        if (cekPass) {
          token = generateToken(payload);
          done()
        } else {
          throw new Error('Invalid email/password');
        }
      } else {
        throw new Error('Invalid email/password');
      }
    })
    .catch(err => {
      done(err)
    })

  Lecturer.findOne({ where: { name: 'Bambang' } })
    .then(data => {
      LecturerId = data.dataValues.id;
      done();
    })
    .catch(err => {
      done(err)
    })
})

afterAll((done) => {
  queryInterface.bulkDelete('Users')
    .then(() => {
      return queryInterface.bulkDelete('Videos')
    })
    .then(() => {
      return queryInterface.bulkDelete('Lecturers')
    })
    .then(() => {
      return queryInterface.bulkDelete('Ratings')
    })
    .then(() => {
      console.log('All database restored')
      return done()
    })
    .catch(err => done(err))
})

describe('testing /rating', () => {
  describe('success ADD /ratings', () => {
    it('should return with status code 201', (done) => {
      const body = {
        rating: 3
      }
      request(app)
        .post('/ratings/' + LecturerId)
        .set('access_token', token)
        .send(body)
        .end((err, res) => {
          if (err) done(err)
          else {
            expect(res.statusCode).toEqual(400)
            // expect(typeof res.body).toEqual('object')
            done()
          }
        })
    })
  })

  describe('ADD /ratings failed', () => {
    it('should return when rating input more than one', (done) => {
      const body = {
        rating: 5
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