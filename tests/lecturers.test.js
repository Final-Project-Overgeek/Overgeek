const request = require("supertest");
const app = require("../app.js");
const { hashPassword, comparePassword } = require("../helpers/bcrypt");
const { User, Lecturer, Rating } = require("../models");
const { generateToken } = require("../helpers/jwt.js");
const { sequelize } = require("../models");
const { queryInterface } = sequelize;
const redis = require("../redis/index");

let invalidAccessToken =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTAyLCJlbWFpbCI6InVzZXJAbWFpbC5jb20iLCJpYXQiOjE2MTg5MjkwNzJ9.kb6VPt5xrbwUdQg4GhSRxvx4y1L8zPmjPB5_HVKsjQ";

jest.mock("axios");

let userLogin = {
  email: 'admin@mail.com',
  password: '12345'
};
let token = '';
let lecturerId = 1;

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

  await queryInterface.bulkInsert('Subscriptions', [
    {
      id: 1,
      name: "monthly",
      image: "https://cdn.discordapp.com/attachments/832204439967236108/834423000647860255/MONTHLY_free-file.png",
      price: 50000,
      days: 30,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 2,
      name: "season",
      image: "https://cdn.discordapp.com/attachments/832204439967236108/834422485235662848/SEASON_free-file.png",
      price: 250000,
      days: 180,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 3,
      name: "annual",
      image: "https://cdn.discordapp.com/attachments/832204439967236108/834422727431290941/ANNUAL_free-file.png",
      price: 400000,
      days: 360,
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

  Lecturer.findOne({ where: { name: 'Rudy Santoso' } })
    .then(data => {
      lecturerId = data.dataValues.id;
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
      console.log('All database restored by Lecturer Test')
      return done()
    })
    .catch(err => done(err))
})

describe("testing /lecturers", () => {
  beforeAll(async (done) => {
    try {
      Lecturer.findAll().then((data) => {
        id = data[0].dataValues.id;
        done();
      });
    } catch (error) {
      done(err);
    }
  });

  /* ======================= CREATE LECTURERS ======================= */

  describe("success POST /lecturers", () => {
    it("should return response with status 201", async (done) => {
      const body = {
        name: "Mario Brows",
        profile: "MOBO",
        game: "PC game",
        role: "Lucky",
        team: "Hadehhhh",
        language: "Kachong",
        image: "image.jpg",
      };
      request(app)
        .post("/lecturers")
        .set("access_token", token)
        .send(body)
        .end((err, res) => {
          if (err) {
            done(err);
          }
          expect(res.statusCode).toEqual(201);
          done();
        });
    });
  });

  describe("POST, /lecturers", function () {
    it("should return status 201 with newly created data", function (done) {
      const body = {
        name: "Mobile Legends",
        profile: "MOBA",
        game: "mobile game",
        role: "mistery",
        team: "Hayabusa",
        language: "english",
        image: "data/d872f5a0d69a4287bd9605b2ed5533e3",
        ratings: 3,
      };
      request(app)
        .post("/lecturers")
        .set({ access_token: token, Accept: "application/json" })
        .send(body)
        .end((err, res) => {
          if (err) {
            done(err);
          } else {
            expect(res.status).toEqual(201);
            expect(typeof res.body).toEqual("object");
            done();
          }
        });
    });
  });

  describe("POST /lecturers failed", () => {
    it("should return response when name is not inputted", (done) => {
      const body = {
        name: "",
        profile: "MOBA",
        game: "mobile game",
        role: "mistery",
        team: ["Hayabusa", "Lancelot"],
        language: "english",
        image: "www.google.co.id",
      };
      request(app)
        .post("/lecturers")
        .set("access_token", token)
        .send(body)
        .end((err, res) => {
          if (err) done(err);
          else {
            expect(res.statusCode).toEqual(400);
            expect(typeof res.body).toEqual("object");
            done();
          }
        });
    });
    it("should return response when access token is not admin", (done) => {
      const body = {
        name: "Mobile Legends",
        profile: "MOBA",
        game: "mobile game",
        role: "mistery",
        team: ["Hayabusa", "Lancelot"],
        language: "english",
        image: "www.google.co.id",
      };
      request(app)
        .post("/lecturers")
        .set(
          "access_token",
          "1eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6OCwiZW1haWwiOiJjdXN0b21lckBlbWFpbC5jb20iLCJ1c2VybmFtZSI6InVzZXJuYW1lMSIsInBob25lX251bWJlciI6IjA5ODA5ODk4Iiwic3Vic2NyaXB0aW9uX2RhdGUiOm51bGwsInJvbGUiOiJjdXN0b21lciIsImlhdCI6MTYxODgxOTE0NH0.UIfA0j4bGGN6Ji8WVLA9VPcrW2UcIuDMkrw3LIQ6dPI"
        )
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
    it("should return response when access_token is empty", (done) => {
      const body = {
        name: "Mobile Legends",
        profile: "MOBA",
        game: "mobile game",
        role: "mistery",
        team: ["Hayabusa", "Lancelot"],
        language: "english",
        image: "www.google.co.id",
      };
      request(app)
        .post("/lecturers")

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
  });

  // /* ======================= UPDATE LECTURERS ======================= */

  describe("success PUT /lecturers", () => {
    it("should return response with status code 200", (done) => {
      const body = {
        name: "Rudy Santoso",
        profile: "MOBA",
        game: "mobile game",
        role: "mistery",
        team: "Hayabusa",
        language: "english",
        image: "www.google.co.id",
      };
      request(app)
        .put("/lecturers/" + id)
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

  describe("PUT /lecturers failed", () => {
    it("should return response when access token is empty", (done) => {
      const body = {
        name: "Mobile Legends Edited",
        profile: "MOBA Edited",
        game: "mobile game edited",
        role: "mistery edited",
        team: ["Hayabusa", "Lancelot", "add new team"],
        language: "english edited",
        image: "www.google.co.id",
      };
      request(app)
        .put("/lecturers/" + id)
        .set("access_token", "")
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
    it("should return response when access token is not admin", (done) => {
      const body = {
        name: "Mobile Legends Edited",
        profile: "MOBA Edited",
        game: "mobile game edited",
        role: "mistery edited",
        team: ["Hayabusa", "Lancelot", "add new team"],
        language: "english edited",
        image: "www.google.co.id",
      };
      request(app)
        .put("/lecturers/" + id)
        .set(
          "access_token",
          "1eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6OCwiZW1haWwiOiJjdXN0b21lckBlbWFpbC5jb20iLCJ1c2VybmFtZSI6InVzZXJuYW1lMSIsInBob25lX251bWJlciI6IjA5ODA5ODk4Iiwic3Vic2NyaXB0aW9uX2RhdGUiOm51bGwsInJvbGUiOiJjdXN0b21lciIsImlhdCI6MTYxODgxOTE0NH0.UIfA0j4bGGN6Ji8WVLA9VPcrW2UcIuDMkrw3LIQ6dPI"
        )
        .send(body)
        .end((err, res) => {
          expect(res.statusCode).toEqual(401);
          expect(res.body).toHaveProperty("message", "Invalid Token!");
          done();
        });
    });
    it("should return response when name is empty", (done) => {
      const body = {
        name: "",
        profile: "MOBA Edited",
        game: "mobile game edited",
        role: "mistery edited",
        team: ["Hayabusa", "Lancelot", "add new team"],
        language: "english edited",
        image: "www.google.co.id",
      };
      request(app)
        .put("/lecturers/" + id)
        .set("access_token", token)
        .send(body)
        .end((err, res) => {
          expect(res.statusCode).toEqual(400);
          expect(Array.isArray(res.body.errorMsg)).toEqual(true);
          expect(res.body.errorMsg).toEqual(
            expect.arrayContaining(["team cannot be an array or an object"])
          );
          done();
        });
    });
    it("should return response when lecturer id is not found", (done) => {
      const body = {
        name: "",
        profile: "MOBA Edited",
        game: "mobile game edited",
        role: "mistery edited",
        team: ["Hayabusa", "Lancelot", "add new team"],
        language: "english edited",
        image: "www.google.co.id",
      };
      request(app)
        .put("/lecturers/999")
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

  // /* ======================= READ LECTURERS REDIS ======================= */

  describe("testing READ /lecturers from REDIS", () => {
    beforeAll((done) => {
      redis
        .set(
          "lecturers",
          JSON.stringify([
            {
              id: 10,
              name: "Pokka",
              profile:
                "Ex Pro Player, currently coaching LOL Wildrift divisions of Onic Esports",
              game: "League of Legends: Wild Rift",
              role: "Coach",
              team: "Onic Esports",
              language: "Indonesia",
              image:
                "https://asset-a.grid.id/crop/0x0:0x0/700x0/photo/2020/06/01/3809461670.jpg",
              rating: 5,
            },
          ])
        )
        .then(() => done());
    });

    it("should return success where status code 200 with redis", (done) => {
      request(app)
        .get("/lecturers")
        .end((err, res) => {
          if (err) done(err);
          else {
            expect(res.statusCode).toEqual(200);
            done();
          }
        });
    });

    afterAll((done) => {
      redis.del("lecturers");
      done();
    });
  });

  describe("testing READ /lecturers/:id from REDIS", () => {
    beforeAll((done) => {
      redis
        .set(
          "lecturer",
          JSON.stringify([
            {
              id: 10,
              name: "Pokka",
              profile:
                "Ex Pro Player, currently coaching LOL Wildrift divisions of Onic Esports",
              game: "League of Legends: Wild Rift",
              role: "Coach",
              team: "Onic Esports",
              language: "Indonesia",
              image:
                "https://asset-a.grid.id/crop/0x0:0x0/700x0/photo/2020/06/01/3809461670.jpg",
              rating: 5,
            },
          ])
        )
        .then(() => done());
    });

    it("should return success where status code 200 with redis", (done) => {
      request(app)
        .get(`/lecturers/${lecturerId}`)
        .end((err, res) => {
          if (err) done(err);
          else {
            expect(res.statusCode).toEqual(200);
            done();
          }
        });
    });

    afterAll((done) => {
      redis.del("lecturer");
      done();
    });
  });

  /* ======================= READ LECTURERS ======================= */

  describe("testing READ /lecturers", () => {
    beforeAll((done) => {
      const ratingData = {
        rating: 0,
        UserId: 2,
        LecturerId: id,
      };
      Rating.create(ratingData).then(() => {
        done();
      });
    });
    it("should return success where status code 200", (done) => {
      request(app)
        .get("/lecturers")
        .end((err, res) => {
          if (err) done(err);
          else {
            expect(res.statusCode).toEqual(200);
            done();
          }
        });
    });
    it("should return success where status code 200", (done) => {
      request(app)
        .get(`/lecturers/${id}`)
        .end((err, res) => {
          if (err) done(err);
          else {
            expect(res.statusCode).toEqual(200);
            done();
          }
        });
    });
    it("should return success where status code 404", (done) => {
      request(app)
        .get("/lecturers/9999")
        .end((err, res) => {
          if (err) done(err);
          else {
            expect(res.statusCode).toEqual(404);
            done();
          }
        });
    });
  });

  describe("testing READ /Lecturers", () => {
    beforeAll((done) => {
      const ratingData = {
        rating: (2, 4, 5),
        UserId: 2,
        LecturerId: id,
      };
      Rating.create(ratingData).then(() => {
        done();
      });
    });
    it("should return success where status code 200", (done) => {
      request(app)
        .get("/lecturers")
        .end((err, res) => {
          if (err) done(err);
          else {
            expect(res.statusCode).toEqual(200);
            done();
          }
        });
    });

    it("should return success where status code 200", (done) => {
      request(app)
        .get(`/lecturers/${id}`)
        .end((err, res) => {
          if (err) done(err);
          else {
            expect(res.statusCode).toEqual(200);
            done();
          }
        });
    });
    it("should return success where status code 404", (done) => {
      request(app)
        .get("/lecturers/9999")
        .end((err, res) => {
          if (err) done(err);
          else {
            expect(res.statusCode).toEqual(404);
            done();
          }
        });
    });
  });

  describe("testing READ /Lecturers", () => {
    beforeAll((done) => {
      redis.del("lecturersGame")
        .then(() => {
          const ratingData = {
            rating: 3,
            UserId: 2,
            LecturerId: id,
          };
          Rating.create(ratingData).then(() => {
            done();
          });
        })

    });
    it("should return success where status code 200", (done) => {
      request(app)
        .get("/lecturers")
        .end((err, res) => {
          if (err) done(err);
          else {
            expect(res.statusCode).toEqual(200);
            done();
          }
        });
    });

    it("should return success where status code 200", (done) => {
      request(app)
        .get(`/lecturers/${id}`)
        .end((err, res) => {
          if (err) done(err);
          else {
            expect(res.statusCode).toEqual(200);
            done();
          }
        });
    });
    it("should return success where status code 200", (done) => {
      request(app)
        .get("/lecturers/99")
        .end((err, res) => {
          if (err) done(err);
          else {
            expect(res.statusCode).toEqual(404);
            done();
          }
        });
    });
  });

  /* ======================= DELETE LECTURERS ======================= */

  describe("testing delete /lecturers", () => {
    beforeAll(async () => {
      await queryInterface.bulkInsert('Lecturers', [
        {
          id: 26,
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
    })

    it("should return response with status 200", (done) => {
      request(app)
        .delete(`/lecturers/26`)
        .set("access_token", token)
        .end((err, res) => {
          if (err) done(err);
          else {
            expect(res.statusCode).toEqual(200);
            done();
          }
        });
    });

    it("should return response when id is not found", (done) => {
      request(app)
        .delete(`/lecturers/999`)
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

  /* ======================= READ GAMES ======================= */

  describe("testing READ /games from REDIS", () => {
    beforeAll((done) => {
      let data = [
        {
          id: 3,
          name: "League of Legends",
          profile: "MMORPG",
          game: "Mobile Legends",
          role: "one",
          team: "others team",
          language: "English",
          image: "www.google.co.id",
          rating: 5,
          videos: "www.video.com",
        },
      ]

      redis
        .set("lecturersGame", JSON.stringify(data))
        .then(() => done());
    });

    it("should return status code 200", (done) => {
      request(app)
        .get("/lecturers/game?game=Mobile Legends")
        .end((err, res) => {
          if (err) done(err);
          else {
            expect(res.statusCode).toEqual(200);
            done();
          }
        });
    });

    afterAll((done) => {
      redis.del("lecturersGame");
    });
  });

  describe("success GET /games", () => {
    beforeAll((done) => {
      const ratingData = {
        rating: 0,
        UserId: 2,
        LecturerId: id,
      };
      let newData = {
        name: "Bambang",
        profile: "Games",
        game: "Mobile Legends",
        role: "Ex Pro",
        team: "Rudy",
        language: "English",
        image: "data/d872f5a0d69a4287bd9605b2ed5533e3"
      }

      Rating.create(ratingData)
        .then(() => {
          return Lecturer.create(newData)
        })
        .then(() => done())
    });

    it("should return status code 200", (done) => {
      request(app)
        .get("/lecturers/game?game=Mobile Legends")
        .end((err, res) => {
          if (err) done(err);
          else {
            expect(res.statusCode).toEqual(200);
            done();
          }
        });
    });
  });
});
