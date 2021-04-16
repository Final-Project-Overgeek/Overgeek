const jwt = require("jsonwebtoken")
const { User } = require("../models/")

const authenticate = async function (req, res, next) {
  try {
    const token = req.headers.access_token
    const decoded = jwt.verify(token, process.env.SECRET)


    let user = await User.findOne({
      where: {
        id: decoded.id
      }
    })
    if (!user) {
      throw {
        name: "customError",
        msg: `Invalid Token`,
        status: 401
      }
    }

    req.decoded = decoded

    next()
  } catch (err) {
    next(err)
  }
}

module.exports = authenticate