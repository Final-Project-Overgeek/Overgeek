const { Rating } = require('../models/')

class RatingController {
  static addRating = async (req, res, next) => {
    try {
      const uniqueRate = await Rating.findAll({
        where: {
          UserId: req.decoded.id
        }
      })
      let counter = uniqueRate.length
      for (let i = 0; i < uniqueRate.length; i++) {
        if (uniqueRate[i].dataValues.LecturerId !== +req.params.id) {
          counter--
        }
      }
      if (counter === 0) {
        const ratingData = {
          rating: req.body.rating,
          UserId: req.decoded.id,
          LecturerId: req.params.id
        }
        const data = await Rating.create(ratingData)
  
        res.status(201).json(data)
      } else {
        throw {
          name: 'customError',
          status: 400,
          msg: 'Your Already Rate This Lecturer!'
        }
      }
    } catch (err) {
      next(err)
    }
  }
}

module.exports = RatingController