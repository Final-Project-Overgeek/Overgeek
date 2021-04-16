const express = require("express")
const router = express.Router()
const LecturerController = require('../controllers/lecturerController')
const authenticate = require('../middlewares/authenticate')
const authorize = require('../middlewares/authorize')

router.get('/', LecturerController.readAllLecturer)
router.get('/:id', LecturerController.readLecturerById)

router.post('/', authenticate, authorize, LecturerController.addLecturer)
router.put('/:id', authenticate, authorize, LecturerController.editLecturer)
router.delete('/:id', authenticate, authorize, LecturerController.deleteLecturer)


module.exports = router