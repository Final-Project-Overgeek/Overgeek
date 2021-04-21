const request = require("supertest");
const app = require("../app");
const { User, Subscription } = require("../models");
const { generateToken } = require("../helpers/jwt");
const redis = require("../redis/index");

let token = "";
let id;

beforeAll((done) => {
  User.findOne({ where: { role: "admin" } })
    .then((data) => {
      token = generateToken(data.dataValues);
      id = data.dataValues.id;
      done();
    })
    .catch((err) => done(err));
});

describe("testing /users", () => {
  /* =====================  READ USER REDIS ===================== */

  describe("testing READ /users from REDIS", () => {
    beforeAll((done) => {
      redis
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
    beforeAll((done) => {
      const subscriptionType = {
        name: "monthly",
        image: "www.google.co.id",
        price: 50000,
        days: 30,
      };
      Subscription.create(subscriptionType).then(() => done());
    });
    it("should return response with status code 200", (done) => {
      const body = {
        username: "your name",
        email: "email@mail.co.id",
        password: "yourpassword",
        premium: false,
        phone_number: "08123456789",
        subscription_date: new Date(),
      };
      request(app)
        .put("/users/")
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
      console.log(id, "<<<<<<<<<<<<<<<< ID");
      const body = {
        username: "your name",
        email: "email@mail.co.id",
        password: "yourpassword",
        premium: false,
        phone_number: "08123456789",
        subscription_data: "2020/12/20",
      };
      request(app)
        .put("/users/" + id)
        .send(body)
        .end((err, res) => {
          if (err) done(err);
          else {
            expect(res.statusCode).toEqual(401);
            expect(res.body).toHaveProperty("message", "jwt must be provided");
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
        .post("/users/1")
        .set("access_token", token)
        .send(body)
        .end((err, res) => {
          if (err) done(err);
          else {
            expect(res.statusCode).toEqual(400);
            expect(res.body).toHaveProperty("message", "Email cant be empty!");
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
        .post("/users/1")
        .set("access_token", token)
        .send(body)
        .end((err, res) => {
          if (err) done(err);
          else {
            expect(res.statusCode).toEqual(400);
            expect(res.body).toHaveProperty("message", "Invalid Email format!");
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
        .post("/users/1")
        .set("access_token", token)
        .send(body)
        .end((err, res) => {
          if (err) done(err);
          else {
            expect(res.statusCode).toEqual(400);
            expect(res.body).toHaveProperty(
              "message",
              "Password cant be empty!"
            );
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
        .post("/users/1")
        .set("access_token", token)
        .send(body)
        .end((err, res) => {
          if (err) done(err);
          else {
            expect(res.statusCode).toEqual(400);
            expect(res.body).toHaveProperty(
              "message",
              "Minimum character for password is 4!"
            );
            done();
          }
        });
    });
  });
});
