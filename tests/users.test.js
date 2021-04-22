const request = require("supertest");
const app = require("../app");
const { User, Subscription } = require("../models");
const { hashPassword, comparePassword } = require("../helpers/bcrypt");
const { generateToken } = require("../helpers/jwt");
const redis = require("../redis/index");
const { sequelize } = require("../models");
const { queryInterface } = sequelize;

let userLogin = {
  email: 'admin@mail.com',
  password: '12345'
};
let token = "";
// let token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJhZG1pbkBtYWlsLmNvbSIsImlhdCI6MTYxOTA0MTEzMn0.ynV5VvIT6RCbU23I6J6KpdpxeQiXFei432KG-Q1cO8s";
let userId = null;

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
  done();

  await queryInterface.bulkInsert('Subscriptions', [
    {
      id: 1,
      name: "monthly",
      image: "https://img.freepik.com/free-photo/number-30_2227-918.jpg?size=626&ext=jpg",
      price: 50000,
      days: 30,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 2,
      name: "season",
      image: "https://img2.pngio.com/6-month-warranty-6-months-warranty-png-png-image-transparent-6-months-png-820_457.png",
      price: 250000,
      days: 180,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 3,
      name: "annual",
      image: "https://www.pngitem.com/pimgs/m/93-938358_transparent-anniversary-png-1-year-anniversary-png-png.png",
      price: 400000,
      days: 360,
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ], {})
  done();


  User.findOne({ where: { email: userLogin.email } })
    .then(data => {
      if (data) {
        let cekPass = comparePassword(userLogin.password, data.password)
        let payload = { id: data.id, email: data.email }
        userId = data.dataValues.id;
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
});

afterAll(async (done) => {
  await queryInterface.bulkDelete('Users')
    .then(() => {
      return queryInterface.bulkDelete('Subscriptions')
    })
    .then(() => {
      console.log('All database restored')
      return done()
    })
    .catch(err => done(err))
})

describe("testing /users", () => {
  /* =====================  READ USER REDIS ===================== */

  describe("testing READ /users from REDIS", () => {
    beforeAll(async (done) => {
      await redis
        .set(
          "users",
          JSON.stringify([
            {
              username: "your name",
              email: "email@mail.co.id",
              password: "yourpassword",
              premium: false,
              phone_number: "08123456789",
              subscription_date: new Date(),
            },
          ])
        )
        .then(() => done());
    });

    it("should return success with status code 200 with redis", (done) => {
      request(app)
        .get("/users")
        .set("access_token", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJhZG1pbkBtYWlsLmNvbSIsImlhdCI6MTYxOTA0MTEzMn0.ynV5VvIT6RCbU23I6J6KpdpxeQiXFei432KG-Q1cO8s")
        .end((err, res) => {
          if (err) done(err);
          else {
            expect(res.statusCode).toEqual(200);
            expect(typeof res.body).toEqual("object");
            done();
          }
        });
    });

    afterAll((done) => {
      redis.del("users");
      done();
    });
  });

  /* =====================  READ USER ===================== */

  describe("success READ /users", () => {
    it("should return response with status code 200", (done) => {
      request(app)
        .get("/users")
        .set("access_token", token)
        .end((err, res) => {
          if (err) done(err);
          else {
            expect(res.statusCode).toEqual(200);
            expect(typeof res.body).toEqual("object");
            done();
          }
        });
    });
  });

  /* =====================  UPDATE USER ===================== */

  describe("success PUT /users", () => {
    it("should return response with status code 200", (done) => {
      const body = {
        gross_amount: 50000
      };

      request(app)
        .put("/users")
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
  });

  describe("PUT /users failed", () => {
    it("should return response when access token is empty", (done) => {
      const body = {
        username: "your name",
        email: "email@mail.co.id",
        password: "yourpassword",
        premium: false,
        phone_number: "08123456789",
        subscription_data: "2020/12/20",
      };
      request(app)
        .put("/users")
        .send(body)
        .end((err, res) => {
          if (err) done(err);
          else {
            expect(res.statusCode).toEqual(401);
            expect(res.body).toHaveProperty("message", "Invalid Token!");
            done();
          }
        });
    });
    it("should return response when email user is empty", (done) => {
      const body = {
        username: "your name",
        email: "",
        password: "yourpassword",
        premium: false,
        phone_number: "08123456789",
        subscription_data: "2020/12/20",
      };
      request(app)
        .put("/users")
        .set("access_token", token)
        .send(body)
        .end((err, res) => {
          if (err) done(err);
          else {
            expect(res.statusCode).toEqual(500);
            expect(res.body).toHaveProperty("message", "Internal Server Error");
            done();
          }
        });
    });
    it("should return response when email format is not email", (done) => {
      const body = {
        username: "your name",
        email: "emailedited",
        password: "yourpassword",
        premium: false,
        phone_number: "08123456789",
        subscription_data: "2020/12/20",
      };
      request(app)
        .put("/users")
        .set("access_token", token)
        .send(body)
        .end((err, res) => {
          if (err) done(err);
          else {
            expect(res.statusCode).toEqual(500);
            expect(res.body).toHaveProperty("message", "Internal Server Error");
            done();
          }
        });
    });
    it("should return response when password edited user is empty", (done) => {
      const body = {
        username: "your name",
        email: "email@mail.com",
        password: "",
        premium: false,
        phone_number: "08123456789",
        subscription_data: "2020/12/20",
      };
      request(app)
        .put("/users")
        .set("access_token", token)
        .send(body)
        .end((err, res) => {
          if (err) done(err);
          else {
            expect(res.statusCode).toEqual(500);
            expect(res.body).toHaveProperty("message", "Internal Server Error");
            done();
          }
        });
    });
    it("should return response when password is less than 4", (done) => {
      const body = {
        username: "your name",
        email: "email@mail.com",
        password: "pas",
        premium: false,
        phone_number: "08123456789",
        subscription_data: "2020/12/20",
      };
      request(app)
        .put("/users")
        .set("access_token", token)
        .send(body)
        .end((err, res) => {
          if (err) done(err);
          else {
            expect(res.statusCode).toEqual(500);
            expect(res.body).toHaveProperty("message", "Internal Server Error");
            done();
          }
        });
    });
  });
});
