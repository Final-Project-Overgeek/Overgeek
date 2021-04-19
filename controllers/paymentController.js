const axios = require('axios')
const { Payment, Transaction, User, Subscription } = require('../models')
const {randomId} = require('../helpers/randomId')
const UserController  = require('./userController')
const countDate = require('../helpers/countDate')
const dateFormat = require('../helpers/dateFormat')

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
      console.log(err)
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
      console.log(err)
      next(err)
    }
  }

  static test(req, res, next){
    console.log(req.params.game)
    if(req.body.settlement){

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
    console.log('Masuk static INFO')
    try {
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
      console.log('subsType',subsType)
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
      console.log(err)
      next(err)
    }
    
  }


  static checkExists(req, res, next){ 
    let id = Number(req.decoded.id)
    let order_id = ''
    Payment.findAll({where: {
      UserId: id
    }})
    .then(data => {
      if(data) { 
        console.log(data[19].dataValues.token)
        order_id = data[19].dataValues.token
        return axios({
          url: `https://api.sandbox.midtrans.com/v2/${data[(data.length - 1)].dataValues.token}/status`,
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization:
            "Basic " +
                  Buffer.from("SB-Mid-server-h9MIi9qG8Vde4JzmQdADfN0Q").toString("base64")
               
            },
        })
      }
      else {
        console.log('tidak ada tagihan')
      }
    })
    .then(data => {
      console.log('asdasd',data.data)
      if(data.data.transaction_status === 'settlement'){
      }
    })
    .catch(err => {
      console.log(err)
    })
  }
}

module.exports = PaymentController