const express = require("express")
const router = express.Router()
const UserController = require('../controllers/userController')
const authenticate = require('../middlewares/authenticate')
const authorize = require('../middlewares/authorize')

router.post('/register', UserController.register)
router.post('/login', UserController.login)

router.get('/users', authenticate, UserController.readUser)

router.put('/users', authenticate, authorize, UserController.editUser)

module.exports = router