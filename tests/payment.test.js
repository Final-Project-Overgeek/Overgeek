const request = require("supertest");
const app = require("../app.js");
const { hashPassword, comparePassword } = require("../helpers/bcrypt");
const { User } = require("../models");
const { generateToken } = require("../helpers/jwt.js");
const { sequelize } = require("../models");
const { queryInterface } = sequelize;
const { randomId } = require("../helpers/randomId");
let userLogin = {
  email: "user@mail.com",
  password: "12345",
};
let access_token = "";
let invalidAccessToken =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTAyLCJlbWFpbCI6InVzZXJAbWFpbC5jb20iLCJpYXQiOjE2MTg5MjkwNzJ9.kb6VPt5xrbwUdQg4GhSRxvx4y1L8zPmjPB5_HVKsjQ";
const axios = require("axios");

jest.mock("axios");

beforeAll((done) => {
  // queryInterface.bulkInsert('Users', [
  //   {
  //     username: 'user',
  //     email: 'user@mail.com',
  //     password: hashPassword('12345'),
  //     phone_number: '08122238849',
  //     premium: false,
  //     subscription_date: null,
  //     role: "customer",
  //     createdAt: new Date(),
  //     updatedAt: new Date()
  //   }
  // ])
  User.findOne({ where: { email: userLogin.email } })
    .then((data) => {
      if (data) {
        let cekPass = comparePassword(userLogin.password, data.password);
        let payload = { id: data.id, email: data.email };
        if (cekPass) {
          access_token = generateToken(payload);
          done();
        } else {
          throw new Error("Invalid email/password");
        }
      } else {
        throw new Error("Invalid email/password");
      }
    })
    .catch((err) => {
      done(err);
    });
});

describe("FOR TESTING ROUTE /payments/...", () => {
  describe("testing POST create token payments/token SUCCESS", () => {
    it("it will return status code 201 and any data", (done) => {
      const data = {
        payload: {
          id: 1,
          name: "monthly",
          image:
            "https://img.freepik.com/free-photo/number-30_2227-918.jpg?size=626&ext=jpg",
          price: 50000,
          days: 30,
          createdAt: "2021-04-18T14:56:25.289Z",
          updatedAt: "2021-04-18T14:56:25.289Z",
        },
      };
      let resp = {
        data: {
          token: "1bbb04eb-69c1-40aa-8fed-ed575c77a7c1",
          redirect_url:
            "https://app.sandbox.midtrans.com/snap/v2/vtweb/1bbb04eb-69c1-40aa-8fed-ed575c77a7c1",
        },
      };

      axios.mockResolvedValue(resp);

      //execute
      request(app)
        .post("/payments/token")
        .set("access_token", access_token)
        .send(data)
        .end((err, res) => {
          if (err) {
            done(err);
          } else {
            //   // assert
            expect(res.statusCode).toEqual(201);
            expect(typeof res.body).toEqual("object");
            expect(res.body).toHaveProperty("token", res.body.token);
            done();
          }
        });
    });
  });

  describe("testing POST create token payments/token ERROR", () => {
    it("it will return status code 500", (done) => {
      let result = {};
      axios.mockResolvedValue(result);

      //execute
      request(app)
        .post("/payments/token")
        .set("access_token", access_token)
        .end((err, res) => {
          if (err) {
            done(err);
          } else {
            // assert
            expect(res.statusCode).toEqual(500);
            expect(typeof res.body).toEqual("object");
            expect(res.body).toHaveProperty("message", "Internal Server Error");
            done();
          }
        });
    });
  });

  describe("testing POST create token payments/token ERROR with Invalid Access Token", () => {
    it("it will return status code 401", (done) => {
      const data = {
        payload: {
          id: 1,
          name: "monthly",
          image:
            "https://img.freepik.com/free-photo/number-30_2227-918.jpg?size=626&ext=jpg",
          price: 50000,
          days: 30,
          createdAt: "2021-04-18T14:56:25.289Z",
          updatedAt: "2021-04-18T14:56:25.289Z",
        },
      };

      let resp = {
        data: {
          token: "1bbb04eb-69c1-40aa-8fed-ed575c77a7c1",
          redirect_url:
            "https://app.sandbox.midtrans.com/snap/v2/vtweb/1bbb04eb-69c1-40aa-8fed-ed575c77a7c1",
        },
      };

      axios.mockResolvedValue(resp);

      //execute
      request(app)
        .post("/payments/token")
        .set("access_token", invalidAccessToken)
        .send(data)
        .end((err, res) => {
          if (err) {
            done(err);
          } else {
            //   // assert
            expect(res.statusCode).toEqual(401);
            expect(typeof res.body).toEqual("object");
            expect(res.body).toHaveProperty("message", "Invalid Token!");
            done();
          }
        });
    });
  });

  // create payment
  describe("testing POST create payments/ SUCCESS", () => {
    it("it will return status code 201", (done) => {
      const data = {
        result: {
          // status_code: '201',
          status_message: "Transaksi sedang diproses",
          transaction_id: "5d251524-4608-4af4-b24b-08efaf64fe71",
          order_id: "order_id_10ug9tk27lvba",
          gross_amount: "50000.00",
          payment_type: "bank_transfer",
          transaction_time: "2021-04-21 10:46:48",
          transaction_status: "pending",
          va_numbers: [{ bank: "bca", va_number: "51799095251" }],
          fraud_status: "accept",
          bca_va_number: "51799095251",
          pdf_url:
            "https://app.sandbox.midtrans.com/snap/v1/transactions/427a1654-36b2-4ae2-aa1b-ab5e97a4516a/pdf",
          finish_redirect_url:
            "https://www.returnhard.com/?order_id=order_id_10ug9tk27lvba&status_code=201&transaction_status=pending",
        },
      };

      //execute
      request(app)
        .post("/payments")
        .set("access_token", access_token)
        .send(data)
        .end((err, res) => {
          if (err) {
            done(err);
          } else {
            //   // assert
            expect(res.statusCode).toEqual(201);
            expect(typeof res.body).toEqual("object");
            // expect(res.body).toHaveProperty('message', "Invalid Token!");
            done();
          }
        });
    });

    describe("testing POST create payments/ ERROR without Access Token", () => {
      it("it will return status code 401", (done) => {
        const data = {
          result: {
            // status_code: '201',
            status_message: "Transaksi sedang diproses",
            transaction_id: "5d251524-4608-4af4-b24b-08efaf64fe71",
            order_id: "order_id_10ug9tk27lvba",
            gross_amount: "50000.00",
            payment_type: "bank_transfer",
            transaction_time: "2021-04-21 10:46:48",
            transaction_status: "pending",
            va_numbers: [{ bank: "bca", va_number: "51799095251" }],
            fraud_status: "accept",
            bca_va_number: "51799095251",
            pdf_url:
              "https://app.sandbox.midtrans.com/snap/v1/transactions/427a1654-36b2-4ae2-aa1b-ab5e97a4516a/pdf",
            finish_redirect_url:
              "https://www.returnhard.com/?order_id=order_id_10ug9tk27lvba&status_code=201&transaction_status=pending",
          },
        };

        //execute
        request(app)
          .post("/payments")
          .send(data)
          .end((err, res) => {
            if (err) {
              done(err);
            } else {
              //   // assert
              expect(res.statusCode).toEqual(401);
              expect(typeof res.body).toEqual("object");
              expect(res.body).toHaveProperty("message", "Invalid Token!");
              done();
            }
          });
      });
    });

    describe("testing POST create payments/ ERROR with empty result", () => {
      it("it will return status code 500", (done) => {
        const data = {
          result: {},
        };

        //execute
        request(app)
          .post("/payments")
          .set("access_token", access_token)
          .send(data)
          .end((err, res) => {
            if (err) {
              done(err);
            } else {
              //   // assert
              expect(res.statusCode).toEqual(500);
              expect(typeof res.body).toEqual("object");
              // expect(res.body).toHaveProperty('message', "Invalid Token!");
              done();
            }
          });
      });
    });

    describe("testing POST payments/info SUCCESS", () => {
      it("it will return status code 201", (done) => {
        const data = {
          order_id: "order_id_10ug9tk27lvba",
          gross_amount: "50000.00",
          transaction_time: "2021-04-21 12:30:30.787+07",
        };

        //execute
        request(app)
          .post("/payments/info")
          .set("access_token", access_token)
          .send(data)
          .end((err, res) => {
            if (err) {
              done(err);
            } else {
              //   // assert
              expect(res.statusCode).toEqual(201);
              expect(typeof res.body).toEqual("object");
              // expect(res.body).toHaveProperty('message', "Invalid Token!");
              done();
            }
          });
      });
    });

    describe("testing POST payments/info ERROR with empty data", () => {
      it("it will return status code 500", (done) => {
        const data = {};

        //execute
        request(app)
          .post("/payments/info")
          .set("access_token", access_token)
          .send(data)
          .end((err, res) => {
            if (err) {
              done(err);
            } else {
              //   // assert
              expect(res.statusCode).toEqual(500);
              expect(typeof res.body).toEqual("object");
              expect(res.body).toHaveProperty(
                "message",
                "Internal Server Error"
              );
              done();
            }
          });
      });
    });
  });
});
