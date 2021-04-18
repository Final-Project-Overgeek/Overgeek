const express = require("express")
const router = express.Router()
const authenticate = require('../middlewares/authenticate')
const PaymentController  = require('../controllers/paymentController')

router.post('/', authenticate, PaymentController.createPayment)
router.post('/token', authenticate, PaymentController.createToken)
// router.post('/token/:game', authenticate, PaymentController.test)
router.get('/check', authenticate, PaymentController.check)


module.exports = router
