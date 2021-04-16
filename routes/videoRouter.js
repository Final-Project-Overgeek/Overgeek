const express = require("express")
const router = express.Router()
const VideoController = require('../controllers/videoController')
const authenticate = require('../middlewares/authenticate')
const authorize = require('../middlewares/authorize')

router.get('/', VideoController.readAllVideos)
router.get('/:id', VideoController.readOneVideo)
router.post('/:id', authenticate, authorize, VideoController.addVideo)
router.put('/:id', authenticate, authorize, VideoController.editVideo)
router.delete('/:id', authenticate, authorize, VideoController.deleteVideo)

module.exports = router