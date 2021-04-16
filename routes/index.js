const express = require("express")
const router = express.Router()
const userRouter = require('./userRouter')
const lecturerRouter = require('./lecturerRouter')
const videoRouter = require('./videoRouter')
const ratingRouter = require('./ratingRouter')

router.use('/lecturers', lecturerRouter)
router.use('/courses', videoRouter)
router.use('/ratings', ratingRouter)
router.use('/', userRouter)

module.exports = router