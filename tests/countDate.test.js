const request = require("supertest");
const app = require("../app");

describe("testing count date", () => {
  describe("success show the count date if success", () => {
    it("should return response with status code 200", (done) => {
      const body = {
        type: 5000,
      };
      request(app);
    });
  });
});
