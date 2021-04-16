const express = require("express")
const router = express.Router()
const UserController = require('../controllers/userController')
const authenticate = require('../middlewares/authenticate')

router.post('/register', UserController.register)
router.post('/login', UserController.login)


router.put('/users', authenticate, UserController.editUser)
router.get('/users', authenticate, UserController.readUser)

module.exports = router