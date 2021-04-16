const { User } = require("../models/")

const authorize = async (req, res, next) => {
  try {
    const data = await User.findOne({
      where: {
        id: req.decoded.id
      }
    })
    
    if (!data) {
      throw {
        name: "customError",
        msg: `User not found!`,
        status: 404
      }
    }

    if (data.role !== 'admin') {
      throw {
        name: "customError",
        msg: `You are not authorized!`,
        status: 400
      }
    }
    next()
  } catch (err) {
    console.log(err)
    next(err)
  }
}

module.exports = authorize