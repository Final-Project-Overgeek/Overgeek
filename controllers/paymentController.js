const axios = require('axios')
const { Payment, Transaction, User, Subscription } = require('../models')
const {randomId} = require('../helpers/randomId')
const UserController  = require('./userController')
const countDate = require('../helpers/countDate')
const dateFormat = require('../helpers/dateFormat')
const signature = require('../helpers/signature')

class PaymentController {
  static createToken(req, res, next){
    let order_id = 'order_id_' + randomId(req.body.payload.name)

    axios({
      url: "https://app.sandbox.midtrans.com/snap/v1/transactions",
      method: "post",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization:
        "Basic " +
              Buffer.from("SB-Mid-server-h9MIi9qG8Vde4JzmQdADfN0Q").toString("base64")
        },
        data: {
          transaction_details: {
            order_id: order_id,
            gross_amount: Number(req.body.payload.price)
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
      next(err)
    })
  }

  static createPayment = async(req, res, next) => {
    try {
      let subsType
      const subscriptionDatas = await Subscription.findAll()
      for (let i = 0; i < subscriptionDatas.length; i++) {
        if (subscriptionDatas[i].price === Number(req.body.result.gross_amount.split('.')[0])) {
          subsType = subscriptionDatas[i].price
        }
      }
      const subscriptionData = await Subscription.findOne({
        where: {
          price: subsType
        }
      })
      const paymentData = await Payment.create({
        method: req.body.result.payment_type,
        status: false,
        UserId: req.decoded.id,
        amount: Number(req.body.result.gross_amount),
        token: req.body.result.order_id,
        subsription_type: subscriptionData.dataValues.name
      })
      res.status(201).json(paymentData)
    } catch (err) {
      next(err)
    }
  }
  
  static check(req, res, next){
    axios({
      url: 'https://api.sandbox.midtrans.com/v2/asdas123sass2323s3dsffgg/status', //order_id
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization:
        "Basic " +
              Buffer.from("SB-Mid-server-h9MIi9qG8Vde4JzmQdADfN0Q").toString("base64")
            // Above is API server key for the Midtrans account, encoded to base64
        },
    })
    .then(data => {
      res.status(200).json(data.data)
    })
    .catch(err => {
      console.log(err)
    })
  }

  static info = async (req, res, next) => {
    try {
      const { order_id, status_code, gross_amount } = req.body
      const signatureKey = signature((order_id + status_code + gross_amount + "SB-Mid-server-h9MIi9qG8Vde4JzmQdADfN0Q"))
      if(signatureKey !== req.body.signature_key){
        throw err
      }
      
      const paymentData = await Payment.findOne({where : {
        token : req.body.order_id
      }})
      const userData = await User.findOne({
        where: {
          id: paymentData.UserId,
        },
      });
      let subsType
      const subscriptionDatas = await Subscription.findAll()
      for (let i = 0; i < subscriptionDatas.length; i++) {
        if (subscriptionDatas[i].price === Number(req.body.gross_amount.split('.')[0])) {
          subsType = subscriptionDatas[i].price
        }
      }
      const subscriptionData = await Subscription.findOne({
        where: {
          price: subsType
        }
      })

      const expiredDate = countDate(subsType)
      
      const data = {
        ...userData,
        premium: true,
        subscription_date: expiredDate
      };

      const editedData = await User.update(data, {
        where: {
          id: paymentData.UserId,
        },
        returning: true,
      });
      const transactionData = await Transaction.create({
        transaction_date: dateFormat(req.body.transaction_time),
        subscription_type: subscriptionData.name,
        UserId: paymentData.UserId
      })
      res.status(201).json(transactionData)

    } catch (err) {
      next(err)
    }
    
  }

  static creditcardPayments = async(req, res, next) => {
    try {
      //table payments
      await Payment.create({
        method: req.body.result.payment_type,
        status: true,
        subsription_type: req.body.payload.name,
        transaction_time: dateFormat(req.body.result.transaction_time),
        UserId: req.decoded.id,
        token: req.body.result.order_id,
        amount: req.body.payload.price
      })
      //table transactions
      const transactionData = await Transaction.create({
        transaction_date: dateFormat(req.body.result.transaction_time),
        subscription_type: req.body.payload.name,
        UserId: req.decoded.id
      })
      //table user
      const userData = await User.findOne({
        where: {
          id: req.decoded.id
        },
      });

      let subsType
      const subscriptionDatas = await Subscription.findAll()
      for (let i = 0; i < subscriptionDatas.length; i++) {
        if (subscriptionDatas[i].price === Number(req.body.result.gross_amount.split('.')[0])) {
          subsType = subscriptionDatas[i].price
        }
      }
      const subscriptionData = await Subscription.findOne({
        where: {
          price: subsType
        }
      })

      const expiredDate = countDate(subsType)
      
      const data = {
        ...userData,
        premium: true,
        subscription_date: expiredDate
      };

      const editedData = await User.update(data, {
        where: {
          id: req.decoded.id,
        },
        returning: true,
      });

      res.status(201).json(transactionData)
    } catch (err) {
      next(err)
    } 
    
  }
}

module.exports = PaymentController