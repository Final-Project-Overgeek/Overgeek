const request = require('supertest');
const app = require('../app.js');

describe("testing Cloud Storage", () => {
  describe("success /uploadImages", () => {
    it("should return with status code 201", (done) => {
      request(app)
        .post("/upload/uploadImages")
        .attach("image", "./TEST.png")
        .timeout(30000)
        .then((res) => {
          expect(res.statusCode).toEqual(201);
          done();
        });
    });
  });
});