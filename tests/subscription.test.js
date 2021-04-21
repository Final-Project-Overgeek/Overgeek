const request = require("supertest");
const app = require("../app");
const { User, Subscription } = require("../models");
const { generateToken } = require("../helpers/jwt");
const redis = require("../redis");
let token = "";
let id;

beforeAll((done) => {
  User.findOne({ where: { role: "admin" } })
    .then((data) => {
      token = generateToken(data.dataValues);
      done();
    })
    .catch((err) => done(err));
});

beforeAll((done) => {
  Subscription.findAll()
    .then((data) => {
      id = data[0].dataValues.id;
      done();
    })
    .catch((err) => {
      done(err);
    });
});

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
        name: "Thor",
        image: "www.google.co.id",
        price: 12000,
        days: 5,
      };
      request(app)
        .put("/subscriptions/" + id)
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
    it("should return response with status code 200", (done) => {
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
        .delete(`/subscriptions/${id}`)
        .set("access_token", token)
        .end((err, res) => {
          if (err) done(err);
          else {
            expect(res.statusCode).toEqual(200);
            done();
          }
        });
    });

    it("should return response with status code 200", (done) => {
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
