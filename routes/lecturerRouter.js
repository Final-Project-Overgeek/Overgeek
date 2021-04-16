const express = require("express")
const router = express.Router()
const LecturerController = require('../controllers/lecturerController')

router.get('/')
router.get('/:id')
router.post('/')
router.put('/:id')
router.delete('/:id')


module.exports = router