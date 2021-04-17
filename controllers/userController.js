const { User } = require('../models/')
const { comparePassword } = require('../helpers/bcrypt')
const { generateToken } = require('../helpers/jwt')

class UserController {
  static register = async (req, res, next) => {
    try {
      const userData = {
        username: req.body.username,
        email: req.body.email,
        password: req.body.password,
        phone_number: req.body.phone_number,
        premium: false,
        subscription_date: null,
        role: 'customer'
      }

      const user = await User.create(userData)

      res.status(201).json({
        id: user.id,
        username: user.username,
        email: user.email,
        phone_number: user.phone_number
      })
    } catch (err) {
      next(err)
    }
  }

  static login = async (req, res, next) => {
    try {
      const { email, password } = req.body
      let user = await User.findOne({
        where: {
          email
        }
      })

      if (!user) {
        user = await User.findOne({
          where: {
            username: email
          }
        })
      }
      
      if (!user) {
        throw {
          name: "customError",
          msg: `Invalid email or password`,
          status: 400
        }
      }

      const comparedPassword = comparePassword(password, user.password)
      if (!comparedPassword) {
        throw {
          name: "customError",
          msg: `Invalid email or password`,
          status: 400
        }
      }

      const access_token = generateToken({
        id: user.id,
        email: user.email,
        username: user.username,
        phone_number: user.phone_number,
        subscription_date: user.subscription_date
      })

      res.status(200).json({
        access_token
      })
    } catch (err) {
      next(err)
    }
  }

  static editUser = async (req, res, next) => {
    try {
      const userData = await User.findOne({
        where: {
          id: req.decoded.id
        }
      })
      const data = {
        ...userData,
        password: req.body.password,
      }

      const editedData = await User.update(data, {
        where: {
          id: req.decoded.id
        },
        returning: true
      })
      res.status(200).json(editedData)
    } catch (err) {
      next(err)
    }
  }

  static readUser = async (req, res, next) => {
    try {
      const user = await User.findOne({
        where: {
          id: req.decoded.id
        }
      })

      const data = {
        id: user.id,
        username: user.username,
        email: user.email,
        premium: user.premium,
        phone_number: user.phone_number,
        subscription_date: user.subscription_date
      }

      res.status(200).json(data)
    } catch (err) {
      next(err)
    }
  }
}

module.exports = UserController