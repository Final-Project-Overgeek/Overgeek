const express = require("express")
const router = express.Router()
const SubsciptionController = require('../controllers/subscriptionController')
const authenticate = require('../middlewares/authenticate')
const authorize = require('../middlewares/authorize')

router.get('/', SubsciptionController.readAllSubscriptions)
router.put('/:id', authenticate, authorize, SubsciptionController.editSubscription)
router.delete('/:id', authenticate, authorize, SubsciptionController.deleteSubscription)
router.post('/', authenticate, authorize, SubsciptionController.addSubscription)

module.exports = router