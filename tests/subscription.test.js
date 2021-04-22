const request = require("supertest");
const app = require("../app");
const { User, Subscription } = require("../models");
const { hashPassword, comparePassword } = require("../helpers/bcrypt");
const { generateToken } = require("../helpers/jwt");
const redis = require("../redis");
const { sequelize } = require("../models");
const { queryInterface } = sequelize;
let token = "";
let subscriptionId = 1;
let userLogin = {
  email: 'admin@mail.com',
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

  await queryInterface.bulkInsert('Lecturers', [
    {
      id: 1,
      name: "Rudy Santoso",
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

  await queryInterface.bulkInsert('Subscriptions', [
    {
      id: 1,
      name: "Hero",
      image: "www.youtube.co.id",
      price: 10000,
      days: 12,
      createdAt: new Date(),
      updatedAt: new Date()
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

  Subscription.findOne({ where: { name: Hero } })
    .then(data => {
      subscriptionId = data.dataValues.id;
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
      return queryInterface.bulkDelete('Subscriptions')
    })
    .then(() => {
      console.log('All database restored')
      return done()
    })
    .catch(err => done(err))
})

describe("testing /subscriptions", () => {
  /* ====================== POST SUBSCRIPTION ====================== */

  describe("success POST /subcriptions", () => {
    it("should return status 201 with newly created data", (done) => {
      const body = {
        name: "Thor",
        image: "www.google.co.id",
        price: 12000,
        days: 5,
      };
      request(app)
        .post("/subscriptions")
        .set("access_token", token)
        .send(body)
        .end((err, res) => {
          if (err) done(err);
          else {
            expect(res.statusCode).toEqual(201);
            done();
          }
        });
    });
  });

  describe("success POST /subcriptions failed", () => {
    it("should return status 201 with newly created data", (done) => {
      const body = {
        name: "Thor",
        image: "www.google.co.id",
        price: "two thousands",
        days: 5,
      };
      request(app)
        .post("/subscriptions")
        .set("access_token", token)
        .send(body)
        .end((err, res) => {
          if (err) done(err);
          else {
            expect(res.statusCode).toEqual(500);
            done();
          }
        });
    });
  });

  /* ====================== GET SUBSCRIPTION REDIS ====================== */

  describe("testing READ /subscriptions from REDIS", () => {
    beforeAll((done) => {
      redis
        .set(
          "subscriptions",
          JSON.stringify([
            {
              name: "Thor",
              image: "www.google.co.id",
              price: "two thousands",
              days: 5,
            },
          ])
        )
        .then(() => done());
    });

    it("should return with status code 200", (done) => {
      request(app)
        .get("/subscriptions")
        .set("access_token", token)
        .end((err, res) => {
          if (err) done(err);
          else {
            expect(res.statusCode).toEqual(201);
            done();
          }
        });
    });

    afterAll((done) => {
      redis.del("subscriptions");
      done();
    });
  });

  /* ====================== GET SUBSCRIPTION REDIS ====================== */

  describe("testing READ /subscriptions from REDIS", () => {
    it("should return with status code 200", (done) => {
      request(app)
        .get("/subscriptions")
        .set("access_token", token)
        .end((err, res) => {
          if (err) done(err);
          else {
            expect(res.statusCode).toEqual(200);
            done();
          }
        });
    });
  });
  // it("should return with status code 200", (done) => {
  //   request(app)
  //     .get("/subscriptions")
  //     .set("access_token", token)
  //     .end((err, res) => {
  //       if (err) done(err);
  //       else {
  //         expect(res.statusCode).toEqual(200);
  //         done();
  //       }
  //     });
  // });

  /* ====================== UPDATE SUBSCRIPTION ====================== */

  describe("success PUT /subcriptions", () => {
    it("should return response with status code 200", (done) => {
      const body = {
        name: "Thorix",
        image: "www.google.co.id",
        price: 1200,
        days: 51,
      };
      request(app)
        .put("/subscriptions/" + subscriptionId)
        .set("access_token", token)
        .send(body)
        .end((err, res) => {
          if (err) done(err);
          else {
            expect(res.statusCode).toEqual(200);
            expect(typeof res.body).toEqual("object");
            done();
          }
        });
    });
    it("should return response with status code 404", (done) => {
      const body = {
        name: "Thor",
        image: "www.google.co.id",
        price: 12000,
        days: 5,
      };
      request(app)
        .put("/subscriptions/" + 21000)
        .set("access_token", token)
        .send(body)
        .end((err, res) => {
          if (err) done(err);
          else {
            expect(res.statusCode).toEqual(404);
            done();
          }
        });
    });
  });

  /* ====================== UPDATE SUBSCRIPTION ====================== */

  describe("testing delete /subsctiptions", () => {
    it("should return response with status code 200", (done) => {
      request(app)
        .delete(`/subscriptions/${subscriptionId}`)
        .set("access_token", token)
        .end((err, res) => {
          if (err) done(err);
          else {
            expect(res.statusCode).toEqual(200);
            done();
          }
        });
    });

    it("should return response with status code 404", (done) => {
      request(app)
        .delete("/subscriptions/" + 2020)
        .set("access_token", token)
        .end((err, res) => {
          if (err) done(err);
          else {
            expect(res.statusCode).toEqual(404);
            done();
          }
        });
    });
  });
});
