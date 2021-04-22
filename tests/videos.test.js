const request = require('supertest');
const app = require('../app.js');
const { hashPassword, comparePassword } = require('../helpers/bcrypt');
const { User, Video, Lecturer } = require('../models');
const { generateToken } = require('../helpers/jwt.js');
const { sequelize } = require("../models");
const { queryInterface } = sequelize;

let userLogin = {
  email: 'admin@mail.com',
  password: '12345'
};
let videoId = null;
let lecturerId = null;
let access_token = '';

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

  User.findOne({ where: { email: userLogin.email } })
    .then(data => {
      if (data) {
        let cekPass = comparePassword(userLogin.password, data.password)
        let payload = { id: data.id, email: data.email }
        if (cekPass) {
          access_token = generateToken(payload);
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

  Video.findOne({ where: { title: "Knowing Your Role" } })
    .then(data => {
      videoId = data.dataValues.id;
      done();
    })
    .catch((err) => {
      done(err);
    })

  Lecturer.findOne({ where: { name: "Rudy Santoso" } })
    .then(data => {
      lecturerId = data.dataValues.id;
      done();
    })
    .catch((err) => {
      done(err);
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
      console.log('All database restored')
      return done()
    })
    .catch(err => done(err))
})

describe('FOR TESTING ROUTE /videos/...', () => {
  describe('testing GET videos/ SUCCESS', () => {
    it("should return success where status code 200", (done) => {
      request(app)
        .get("/courses")
        .end((err, res) => {
          if (err) done(err);
          else {
            expect(res.statusCode).toEqual(200);
            expect(typeof res.body).toEqual("object");
            done();
          }
        });
    });
  })

  describe('testing GET videos/:id SUCCESS by Id', () => {
    it("should return success where status code 200", (done) => {

      request(app)
        .get("/courses/" + videoId)
        .end((err, res) => {
          if (err) done(err);
          else {
            expect(res.statusCode).toEqual(200);
            expect(typeof res.body).toEqual("object");
            done();
          }
        });
    });
  })

  describe('testing GET videos/:id ERROR with null Id', () => {
    it("should return success where status code 500", (done) => {

      request(app)
        .get("/courses/" + null)
        .end((err, res) => {
          if (err) done(err);
          else {
            expect(res.statusCode).toEqual(500);
            expect(typeof res.body).toEqual("object");
            expect(res.body).toHaveProperty("message", "Internal Server Error");
            done();
          }
        });
    });
  })

  describe('testing POST videos/:id SUCCESS by lecturerId', () => {
    it("should return success where status code 201", (done) => {
      const data = {
        title: "Pro Rudy Learning",
        url: "/upload/data/05bde798a27c0951cf535e2e55ee2KKB",
        thumbnail: "https://imgur.com/a/0CWNOOH",
        isFree: true
      }

      request(app)
        .post("/courses/" + lecturerId)
        .set("access_token", access_token)
        .send(data)
        .end((err, res) => {
          if (err) done(err);
          else {
            expect(res.statusCode).toEqual(201);
            expect(typeof res.body).toEqual("object");
            done();
          }
        });
    });
  })

  describe('testing POST videos/:id ERROR by WRONG lecturerId', () => {
    it("should return success where status code 500", (done) => {
      const data = {
        title: "Pro Rudy Learning",
        url: "/upload/data/05bde798a27c0951cf535e2e55ee2KKB",
        thumbnail: "https://imgur.com/a/0CWNOOH",
        isFree: true
      }

      request(app)
        .post("/courses/" + 1000)
        .set("access_token", access_token)
        .send(data)
        .end((err, res) => {
          if (err) done(err);
          else {
            expect(res.statusCode).toEqual(500);
            expect(typeof res.body).toEqual("object");
            expect(res.body).toHaveProperty("message", "Internal Server Error");
            done();
          }
        });
    });
  })

  describe('testing DELETE videos/:id SUCCESS by videoId', () => {
    it("should return success where status code 200", (done) => {
      request(app)
        .delete("/courses/" + videoId)
        .set("access_token", access_token)
        .end((err, res) => {
          if (err) done(err);
          else {
            expect(res.statusCode).toEqual(200);
            expect(typeof res.body).toEqual("object");
            done();
          }
        });
    });
  })

  describe('testing DELETE videos/:id ERROR by WRONG videoId', () => {
    it("should return success where status code 404", (done) => {
      request(app)
        .delete("/courses/" + 10000)
        .set("access_token", access_token)
        .end((err, res) => {
          if (err) done(err);
          else {
            expect(res.statusCode).toEqual(404);
            expect(typeof res.body).toEqual("object");
            done();
          }
        });
    });
  })

  describe('testing PUT videos/:id SUCCESS by videoId', () => {
    it("should return success where status code 200", (done) => {
      const data = {
        title: "Bambang E-sport Learning",
        url: "/upload/data/05bde798a27c0951cf5356789e2e55ee2KKB",
        thumbnail: "https://imgur.com/aBCDEFGH/0CWNOOH",
        isFree: false
      }

      request(app)
        .put("/courses/" + 1)
        .set("access_token", access_token)
        .send(data)
        .end((err, res) => {
          if (err) done(err);
          else {
            expect(res.statusCode).toEqual(200);
            expect(typeof res.body).toEqual("object");
            done();
          }
        });
    });
  })

  describe('testing PUT videos/:id ERROR by WRONG videoId', () => {
    it("should return success where status code 404", (done) => {
      const data = {
        title: "Bambang E-sport Learning",
        url: "/upload/data/05bde798a27c0951cf535e2e55ee2KKB",
        thumbnail: "https://imgur.com/a/0CWNOOH",
        isFree: true
      }

      request(app)
        .put("/courses/" + 10000)
        .set("access_token", access_token)
        .send(data)
        .end((err, res) => {
          if (err) done(err);
          else {
            expect(res.statusCode).toEqual(404);
            expect(typeof res.body).toEqual("object");
            done();
          }
        });
    });
  })

})




// const request = require("supertest");
// const app = require("../app");
// const { User, Lecturer } = require("../models");
// const { generateToken } = require("../helpers/jwt");
// const redis = require("../redis/index");
// let token =
//   "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6OCwiZW1haWwiOiJhZG1pbjcyQG1haWwuY29tIiwidXNlcm5hbWUiOiJodWFtaXJhIiwicGhvbmVfbnVtYmVyIjoiMDk4MDk4OTgiLCJzdWJzY3JpcHRpb25fZGF0ZSI6bnVsbCwicm9sZSI6ImFkbWluIiwiaWF0IjoxNjE4OTU1MjA5fQ.aSfDnXr-Z6rwpxIXx_EtueNTdYQsydSa3uNBF421BJU";
// let LecturerId;

// describe("testing /courses", () => {
//   beforeAll((done) => {
//     Lecturer.findAll()
//       .then((data) => {
//         console.log(data, "<<<<<<< TES");
//         LecturerId = data[0].dataValues.id;
//         done();
//       })
//       .catch((err) => done(err));
//   });

//   beforeAll((done) => {
//     User.findOne({ where: { role: "admin" } })
//       .then((data) => {
//         // token = generateToken(data.dataValues);
//         done();
//       })
//       .catch((err) => done(err));
//   });
// });

// describe("testing /courses", () => {
//   /* ======================= CREATE COURSES ======================= */

//   describe("success POST /courses", () => {
//     it("should return response with status 201", (done) => {
//       console.log(token, "TOKET");
//       const body = {
//         title: "hello world",
//         url: "https://google.co.id",
//         thumbnail: "acak",
//         isFree: false,
//         // LecturerId: 210,
//       };
//       request(app)
//         .post("/courses/210")
//         .set("access_token", token)
//         .send(body)
//         .end((err, res) => {
//           if (err) done(err);
//           else {
//             expect(res.statusCode).toEqual(201);
//             expect(typeof res.body).toEqual("object");
//             done();
//           }
//         });
//     });
//   });

//   // describe('POST /courses failed', () => {
//   //   it('should return response when access token is empty', (done) => {
//   //     const body = {
//   //       title: 'hello world',
//   //       url: 'https://google.co.id',
//   //       thumbnail: 'acak',
//   //       isFree: false
//   //     }
//   //     request(app)
//   //       .post('/courses')
//   //       .send(body)
//   //       .end((err, res) => {
//   //         if (err) done(err)
//   //         else {
//   //           expect(res.statusCode).toEqual(401);
//   //           expect(typeof res.body).toEqual('object');
//   //           expect(res.body).toHaveProperty("message", "jwt must be provided")
//   //           done()
//   //         }
//   //       })
//   //   })
//   //   it('should return response when access token is wrong', (done) => {
//   //     const body = {
//   //       title: 'hello world',
//   //       url: 'https://google.co.id',
//   //       thumbnail: 'acak',
//   //       isFree: false
//   //     }
//   //     request(app)
//   //       .post('/courses')
//   //       .set('access_token', 'wrong token')
//   //       .send(body)
//   //       .end((err, res) => {
//   //         if (err) done(err)
//   //         else {
//   //           expect(res.statusCode).toEqual(401);
//   //           expect(typeof res.body).toEqual('object');
//   //           expect(res.body).toHaveProperty("message", "jwt malformed")
//   //           done()
//   //         }
//   //       })
//   //   })
//   //   // it('should return response when title is empty', (done) => {
//   //   //   const body = {
//   //   //     title: '',
//   //   //     url: 'https://google.co.id',
//   //   //     thumbnail: 'acak',
//   //   //     isFree: false
//   //   //   }
//   //   //   request(app)
//   //   //     .post('/courses')
//   //   //     .set('access_token', token)
//   //   //     .send(body)
//   //   //     .end((err, res) => {
//   //   //       if (err) done(err)
//   //   //       else {
//   //   //         expect(res.statusCode).toEqual(400);
//   //   //         expect(typeof res.body).toEqual('object');
//   //   //         // expect(res.body).toHaveProperty("message", "please input title")
//   //   //         done()
//   //   //       }
//   //   //     })
//   //   // })
//   //   // it('should return response when url is empty', (done) => {
//   //   //   const body = {
//   //   //     title: 'hello world',
//   //   //     url: '',
//   //   //     thumbnail: 'acak',
//   //   //     isFree: false
//   //   //   }
//   //   //   request(app)
//   //   //     .post('/courses')
//   //   //     .set('access_token', token)
//   //   //     .send(body)
//   //   //     .end((err, res) => {
//   //   //       if (err) done(err)
//   //   //       else {
//   //   //         expect(res.statusCode).toEqual(400);
//   //   //         expect(typeof res.body).toEqual('object');
//   //   //         // expect(res.body).toHaveProperty("message", "please input title")
//   //   //         done()
//   //   //       }
//   //   //     })
//   //   // })
//   // })

//   /* ======================= READ COURSES REDIS ======================= */

//   describe("testing READ /courses from REDIS", () => {
//     beforeAll((done) => {
//       redis
//         .set(
//           "videos",
//           JSON.stringify([
//             {
//               id: 210,
//               title: "Lutung Kasarung",
//               url: "https://google.co.id",
//               thumbnail: "acak",
//               isFree: false,
//             },
//           ])
//         )
//         .then(() => done());
//     });

//     it("should return status code 200", (done) => {
//       request(app)
//         .get("/courses")
//         .set("access_token", token)
//         .end((err, res) => {
//           if (err) done(err);
//           else {
//             expect(res.statusCode).toEqual(200);
//             done();
//           }
//         });
//     });

//     afterAll((done) => {
//       redis.del("lecturers");
//       done();
//     });
//   });

//   describe("testing READ /courses/:id from REDIS", () => {
//     beforeAll((done) => {
//       redis
//         .set(
//           "video",
//           JSON.stringify([
//             {
//               id: 210,
//               title: "Lutung Kasarung",
//               url: "https://google.co.id",
//               thumbnail: "acak",
//               isFree: false,
//             },
//           ])
//         )
//         .then(() => done());
//     });

//     it("should return status code 200", (done) => {
//       request(app)
//         .get("/courses/" + 210)
//         .set("access_token", token)
//         .end((err, res) => {
//           if (err) done(err);
//           else {
//             expect(res.statusCode).toEqual(200);
//             done();
//           }
//         });
//     });

//     afterAll((done) => {
//       redis.del("lecturers");
//       done();
//     });
//   });

//   /* ======================= READ COURSES ======================= */

//   describe("success READ /courses", () => {
//     it("should return response with status code 200", (done) => {
//       request(app)
//         .get("/courses")
//         .set("access_token", token)
//         .end((err, res) => {
//           if (err) done(err);
//           else {
//             expect(res.statusCode).toEqual(200);
//             expect(typeof res.body).toEqual("object");
//             done();
//           }
//         });
//     });

//     it("should return response with status code 200", (done) => {
//       request(app)
//         .get("/courses" + 210)
//         .set("access_token", token)
//         .end((err, res) => {
//           if (err) done(err);
//           else {
//             expect(res.statusCode).toEqual(200);
//             expect(typeof res.body).toEqual("object");
//             done();
//           }
//         });
//     });
//   });

//   // /* ======================= UPDATE COURSES ======================= */

//   // describe('success PUT /courses', () => {
//   //   it('should return response with status code 200', (done) => {
//   //     const body = {
//   //       title: 'edited videos',
//   //       url: 'https://google.co.id',
//   //       thumbnail: 'acak',
//   //       isFree: false
//   //     }
//   //     request(app)
//   //       .put('/courses/1')
//   //       .set('access_token', token)
//   //       .send(body)
//   //       .end((err, res) => {
//   //         if (err) done(err)
//   //         else {
//   //           expect(res.statusCode).toEqual(200)
//   //           expect(typeof res.body).toEqual('object');
//   //           done()
//   //         }
//   //       })
//   //   })
//   // })

//   // describe('PUT /courses failed', () => {
//   //   it('should return response when access token is empty', (done) => {
//   //     const body = {
//   //       title: 'edited videos',
//   //       url: 'https://google.co.id',
//   //       thumbnail: 'acak',
//   //       isFree: false
//   //     }
//   //     request(app)
//   //       .put('/courses/1')
//   //       .send(body)
//   //       .end((err, res) => {
//   //         if (err) done(err)
//   //         else {
//   //           expect(res.statusCode).toEqual(400);
//   //           expect(typeof res.body).toEqual('object');
//   //           expect(res.body).toHaveProperty('mesage', 'jwt must be provided')
//   //         }
//   //       })
//   //   })
//   // })

//   // /* ======================= DELETE COURSES ======================= */

//   // describe('success DELETE /courses', () => {
//   //   it('should return response with status 200', (done) => {
//   //     request(app)
//   //       .delete('/courses/1')
//   //       .set('access_token', token)
//   //       .send(body)
//   //       .end((err, res) => {
//   //         if (err) done(err)
//   //         else {
//   //           expect(res.statusCode).toEqual(200)
//   //           done()
//   //         }
//   //       })
//   //   })
//   // })

//   // describe('DELETE /courses failed', () => {
//   //   it('should return response with status 401', (done) => {
//   //     request(app)
//   //       .delete('/courses/99')
//   //       .set('access_token', token)
//   //       .send(body)
//   //       .end((err, res) => {
//   //         if (err) done(err)
//   //         else {
//   //           expect(res.statusCode).toEqual(401)
//   //           done()
//   //         }
//   //       })
//   //   })
//   // })
// });
