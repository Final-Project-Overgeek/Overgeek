const express = require("express")
const router = express.Router()
const VideoController = require('../controllers/videoController')

router.get('/')
router.get('/:id')
router.post('/')
router.put('/:id')
router.delete('/:id')

module.exports = router