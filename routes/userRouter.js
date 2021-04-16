const express = require("express")
const router = express.Router()
const UserController = require('../controllers/userController')
const authenticate = require('../middlewares/authenticate')

router.post('/register', UserController.register)
router.post('/login', UserController.login)

router.use(authenticate)

router.put('/users', UserController.editUser)
router.get('/users', UserController.readUser)

module.exports = router