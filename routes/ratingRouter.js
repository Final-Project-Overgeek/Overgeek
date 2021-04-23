const express = require("express")
const router = express.Router()
const RatingController = require('../controllers/ratingController')
const authenticate = require('../middlewares/authenticate')

router.post('/:id', authenticate, RatingController.addRating)

module.exports = router