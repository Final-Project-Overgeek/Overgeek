const express = require("express")
const router = express.Router()
const userRouter = require('./userRouter')
const lecturerRouter = require('./lecturerRouter')
const videoRouter = require('./videoRouter')

router.use('/', userRouter)
router.use('/lecturers', lecturerRouter)
router.use('/courses', videoRouter)


module.exports = router