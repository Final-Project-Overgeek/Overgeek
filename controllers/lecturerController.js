const { Lecturer, Rating, Video } = require('../models/')
const fs = require('fs');

class LecturerController {
  static readAllLecturer = async (req, res, next) => {
    try {
      const data = await Lecturer.findAll({
        include: [{
          model: Rating
        },
        {
          model: Video
        }],
        attributes: ['id', 'name', 'profile', 'game', 'role', 'team', 'language', 'image']
      })
      let output = []
      // console.log('========= BEFORE 1');
      for (let i = 0; i < data.length; i++) {
        let lecturerRating = 0
        // console.log('========== BEFORE 2');
        console.log(data[i]);
        for (let j = 0; j < data[i].dataValues.Ratings.length; j++) {
          lecturerRating += data[i].dataValues.Ratings[j].rating
        }
        if (lecturerRating === 0) {
          lecturerRating = 5
        } else {
          lecturerRating /= data[i].dataValues.Ratings.length
        }
        // console.log('======= BEFORE 3');
        output.push({
          id: data[i].id,
          name: data[i].name,
          profile: data[i].profile,
          game: data[i].game,
          role: data[i].role,
          team: data[i].team,
          language: data[i].language,
          image: data[i].image,
          rating: lecturerRating,
          videos: data[i].dataValues.Videos
        })
      }

      res.status(200).json(output)
    } catch (err) {
      next(err)
    }
  }

  static readLecturerById = async (req, res, next) => {
    try {
      const data = await Lecturer.findOne({
        where: {
          id: +req.params.id
        },
        include: [{
          model: Video
        },{
          model: Rating
        }],
        attributes: ['id', 'name', 'profile', 'game', 'role', 'team', 'language', 'image']
      })

      if (!data) {
        throw {
          name: "customError",
          msg: `404 not found`,
          status: 404
        }
      }
      let output = []
      let lecturerRating = 0
      for (let i = 0; i < data.dataValues.Ratings.length; i++) {
        lecturerRating += data.dataValues.Ratings[i].rating
      }

      if (lecturerRating === 0) {
        lecturerRating = 5
      } else {
        lecturerRating /= data.dataValues.Ratings.length
      }
      output.push({
        id: data.id,
        name: data.name,
        profile: data.profile,
        game: data.game,
        role: data.role,
        team: data.team,
        language: data.language,
        image: data.image,
        rating: lecturerRating,
        videos: data.dataValues.Videos
      })

      res.status(200).json(output)
    } catch (err) {
      next(err)
    }
  }

  static addLecturer = async (req, res, next) => {
    try {
      const dataFile = fs.readFileSync('./key.csv', 'utf-8');
      const image = `data/${dataFile}`;

      const { name, profile, game, role, team, language } = req.body
      const lecturerData = { name, profile, game, role, team, language, image}

      const data = await Lecturer.create(lecturerData)

      res.status(201).json(data)
    } catch (err) {
      next(err)
    }
  }

  static editLecturer = async (req, res, next) => {
    try {
      const dataFile = fs.readFileSync('./key.csv', 'utf-8');
      const image = `data/${dataFile}`;

      const findData = await Lecturer.findByPk(+req.params.id)
      if (!findData) {
        throw {
          name: "customError",
          msg: `404 not found`,
          status: 404
        }
      }

      const { name, profile, game, role, team, language } = req.body
      const lecturerData = { name, profile, game, role, team, language, image}

      const data = await Lecturer.update(lecturerData, {
        where: {
          id: +req.params.id
        },
        returning: true
      })

      if (data[0] !== 0) {
        res.status(200).json(data)
      } 
    } catch (err) {
      next(err)
    }
  }

  static deleteLecturer = async (req, res, next) => {
    try {
      const findData = await Lecturer.findByPk(+req.params.id)
      if (!findData) {
        throw {
          name: "customError",
          msg: `404 not found`,
          status: 404
        }
      }

      const data = await Lecturer.destroy({
        where: {
          id: +req.params.id
        }
      })

      if (data[0] !== 0) {
        res.status(200).json({msg: "Delete Lecturer Completed!"})
      } else {
        // throw {
        //   name: "customError",
        //   msg: "`Invalid ID",
        //   status: 404
        // }
      }
    } catch (err) {
      next(err)
    }
  }

  static readLecturerByGame = async (req, res , next) => {
    try {
      const data = await Lecturer.findAll({
        where: {
          game: req.query.game
        },
        include: [{
          model: Rating
        },
        {
          model: Video
        }]
      })
      let output = []

      for (let i = 0; i < data.length; i++) {
        let lecturerRating = 0
        for (let j = 0; j < data[i].dataValues.Ratings.length; j++) {
          lecturerRating += data[i].dataValues.Ratings[j].rating
        }
        if (lecturerRating === 0) {
          lecturerRating = 5
        } else {
          lecturerRating /= data[i].dataValues.Ratings.length
        }
        output.push({
          id: data[i].id,
          name: data[i].name,
          profile: data[i].profile,
          game: data[i].game,
          role: data[i].role,
          team: data[i].team,
          language: data[i].language,
          image: data[i].image,
          rating: lecturerRating,
          videos: data[i].dataValues.Videos
        })
      }

      res.status(200).json(output)
    } catch (err) {
      next(err)
    }
  }
}

module.exports = LecturerController