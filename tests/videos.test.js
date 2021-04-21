const request = require("supertest");
const app = require("../app");
const { User, Lecturer } = require("../models");
const { generateToken } = require("../helpers/jwt");
const redis = require("../redis/index");
let token =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6OCwiZW1haWwiOiJhZG1pbjcyQG1haWwuY29tIiwidXNlcm5hbWUiOiJodWFtaXJhIiwicGhvbmVfbnVtYmVyIjoiMDk4MDk4OTgiLCJzdWJzY3JpcHRpb25fZGF0ZSI6bnVsbCwicm9sZSI6ImFkbWluIiwiaWF0IjoxNjE4OTU1MjA5fQ.aSfDnXr-Z6rwpxIXx_EtueNTdYQsydSa3uNBF421BJU";
let LecturerId;

describe("testing /courses", () => {
  beforeAll((done) => {
    Lecturer.findAll()
      .then((data) => {
        console.log(data, "<<<<<<< TES");
        LecturerId = data[0].dataValues.id;
        done();
      })
      .catch((err) => done(err));
  });

  beforeAll((done) => {
    User.findOne({ where: { role: "admin" } })
      .then((data) => {
        // token = generateToken(data.dataValues);
        done();
      })
      .catch((err) => done(err));
  });
});

describe("testing /courses", () => {
  /* ======================= CREATE COURSES ======================= */

  describe("success POST /courses", () => {
    it("should return response with status 201", (done) => {
      console.log(token, "TOKET");
      const body = {
        title: "hello world",
        url: "https://google.co.id",
        thumbnail: "acak",
        isFree: false,
        // LecturerId: 210,
      };
      request(app)
        .post("/courses/210")
        .set("access_token", token)
        .send(body)
        .end((err, res) => {
          if (err) done(err);
          else {
            expect(res.statusCode).toEqual(201);
            expect(typeof res.body).toEqual("object");
            done();
          }
        });
    });
  });

  // describe('POST /courses failed', () => {
  //   it('should return response when access token is empty', (done) => {
  //     const body = {
  //       title: 'hello world',
  //       url: 'https://google.co.id',
  //       thumbnail: 'acak',
  //       isFree: false
  //     }
  //     request(app)
  //       .post('/courses')
  //       .send(body)
  //       .end((err, res) => {
  //         if (err) done(err)
  //         else {
  //           expect(res.statusCode).toEqual(401);
  //           expect(typeof res.body).toEqual('object');
  //           expect(res.body).toHaveProperty("message", "jwt must be provided")
  //           done()
  //         }
  //       })
  //   })
  //   it('should return response when access token is wrong', (done) => {
  //     const body = {
  //       title: 'hello world',
  //       url: 'https://google.co.id',
  //       thumbnail: 'acak',
  //       isFree: false
  //     }
  //     request(app)
  //       .post('/courses')
  //       .set('access_token', 'wrong token')
  //       .send(body)
  //       .end((err, res) => {
  //         if (err) done(err)
  //         else {
  //           expect(res.statusCode).toEqual(401);
  //           expect(typeof res.body).toEqual('object');
  //           expect(res.body).toHaveProperty("message", "jwt malformed")
  //           done()
  //         }
  //       })
  //   })
  //   // it('should return response when title is empty', (done) => {
  //   //   const body = {
  //   //     title: '',
  //   //     url: 'https://google.co.id',
  //   //     thumbnail: 'acak',
  //   //     isFree: false
  //   //   }
  //   //   request(app)
  //   //     .post('/courses')
  //   //     .set('access_token', token)
  //   //     .send(body)
  //   //     .end((err, res) => {
  //   //       if (err) done(err)
  //   //       else {
  //   //         expect(res.statusCode).toEqual(400);
  //   //         expect(typeof res.body).toEqual('object');
  //   //         // expect(res.body).toHaveProperty("message", "please input title")
  //   //         done()
  //   //       }
  //   //     })
  //   // })
  //   // it('should return response when url is empty', (done) => {
  //   //   const body = {
  //   //     title: 'hello world',
  //   //     url: '',
  //   //     thumbnail: 'acak',
  //   //     isFree: false
  //   //   }
  //   //   request(app)
  //   //     .post('/courses')
  //   //     .set('access_token', token)
  //   //     .send(body)
  //   //     .end((err, res) => {
  //   //       if (err) done(err)
  //   //       else {
  //   //         expect(res.statusCode).toEqual(400);
  //   //         expect(typeof res.body).toEqual('object');
  //   //         // expect(res.body).toHaveProperty("message", "please input title")
  //   //         done()
  //   //       }
  //   //     })
  //   // })
  // })

  /* ======================= READ COURSES REDIS ======================= */

  describe("testing READ /courses from REDIS", () => {
    beforeAll((done) => {
      redis
        .set(
          "videos",
          JSON.stringify([
            {
              id: 210,
              title: "Lutung Kasarung",
              url: "https://google.co.id",
              thumbnail: "acak",
              isFree: false,
            },
          ])
        )
        .then(() => done());
    });

    it("should return status code 200", (done) => {
      request(app)
        .get("/courses")
        .set("access_token", token)
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

  describe("testing READ /courses/:id from REDIS", () => {
    beforeAll((done) => {
      redis
        .set(
          "video",
          JSON.stringify([
            {
              id: 210,
              title: "Lutung Kasarung",
              url: "https://google.co.id",
              thumbnail: "acak",
              isFree: false,
            },
          ])
        )
        .then(() => done());
    });

    it("should return status code 200", (done) => {
      request(app)
        .get("/courses/" + 210)
        .set("access_token", token)
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

  /* ======================= READ COURSES ======================= */

  describe("success READ /courses", () => {
    it("should return response with status code 200", (done) => {
      request(app)
        .get("/courses")
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

    it("should return response with status code 200", (done) => {
      request(app)
        .get("/courses" + 210)
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

  // /* ======================= UPDATE COURSES ======================= */

  // describe('success PUT /courses', () => {
  //   it('should return response with status code 200', (done) => {
  //     const body = {
  //       title: 'edited videos',
  //       url: 'https://google.co.id',
  //       thumbnail: 'acak',
  //       isFree: false
  //     }
  //     request(app)
  //       .put('/courses/1')
  //       .set('access_token', token)
  //       .send(body)
  //       .end((err, res) => {
  //         if (err) done(err)
  //         else {
  //           expect(res.statusCode).toEqual(200)
  //           expect(typeof res.body).toEqual('object');
  //           done()
  //         }
  //       })
  //   })
  // })

  // describe('PUT /courses failed', () => {
  //   it('should return response when access token is empty', (done) => {
  //     const body = {
  //       title: 'edited videos',
  //       url: 'https://google.co.id',
  //       thumbnail: 'acak',
  //       isFree: false
  //     }
  //     request(app)
  //       .put('/courses/1')
  //       .send(body)
  //       .end((err, res) => {
  //         if (err) done(err)
  //         else {
  //           expect(res.statusCode).toEqual(400);
  //           expect(typeof res.body).toEqual('object');
  //           expect(res.body).toHaveProperty('mesage', 'jwt must be provided')
  //         }
  //       })
  //   })
  // })

  // /* ======================= DELETE COURSES ======================= */

  // describe('success DELETE /courses', () => {
  //   it('should return response with status 200', (done) => {
  //     request(app)
  //       .delete('/courses/1')
  //       .set('access_token', token)
  //       .send(body)
  //       .end((err, res) => {
  //         if (err) done(err)
  //         else {
  //           expect(res.statusCode).toEqual(200)
  //           done()
  //         }
  //       })
  //   })
  // })

  // describe('DELETE /courses failed', () => {
  //   it('should return response with status 401', (done) => {
  //     request(app)
  //       .delete('/courses/99')
  //       .set('access_token', token)
  //       .send(body)
  //       .end((err, res) => {
  //         if (err) done(err)
  //         else {
  //           expect(res.statusCode).toEqual(401)
  //           done()
  //         }
  //       })
  //   })
  // })
});
