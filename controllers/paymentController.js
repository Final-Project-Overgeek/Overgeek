const axios = require('axios')
const { Payment } = require('../models')

class PaymentController {
  static createToken(req, res, next){
    let order_id = 0
    console.log('masuk sini om')

    axios({
      url: "https://app.sandbox.midtrans.com/snap/v1/transactions",
      method: "post",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization:
        "Basic " +
              Buffer.from("SB-Mid-server-h9MIi9qG8Vde4JzmQdADfN0Q").toString("base64")
            // Above is API server key for the Midtrans account, encoded to base64
        },
        data: {
          transaction_details: {
            order_id: 'asdasdsadasdsadsad1wd',
            gross_amount: req.body.amount
          },
          credit_card: {
            secure: true
          },
          customer_details: {
            email: req.decoded.email,
            phone: req.decoded.phone_number
          }
      }
    })
    .then(data => {
      res.status(201).json(data.data)
    })
    .catch(err => {
      console.log(err)
    })
  }

  static createPayment(req, res, next){
    console.log(req.body)
    Payment.create({
      method: req.body.result.payment_type,
      status: false,
      UserId: req.decoded.id,
      amount: Number(req.body.result.gross_amount),
      token: req.body.result.transaction_id
    })
    .then(data => {
      console.log(data)
      res.status(201).json(data)
    })
    .catch(err => {
      console.log(err)
      res.status(500).json(err)
    })
  }
}

module.exports = PaymentController