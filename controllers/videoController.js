const { Video }  = require('../models/')
const fs = require('fs')

class VideoController {
  static readAllVideos = async (req, res, next) => {
    try {
      const data = await Video.findAll()

      res.status(200).json(data)
    } catch(err) {
      next(err)
    }
  }

  static readOneVideo = async (req, res, next) => {
    try {
      const data = await Video.findOne({
        where: {
          id: +req.params.id
        }
      })

      res.status(200).json(data)
    } catch (err) {
      next(err)
    }
  }

  static addVideo = async (req, res, next) => {
    try {
      const videos = fs.readFileSync('./key.csv', 'utf-8');
      const url = `data/${videos}`;

      const { title, thumbnail, isFree } = req.body
      const data = await Video.create({
        title,
        url,
        thumbnail,
        isFree,
        LecturerId: +req.params.id
      })

      res.status(201).json(data)
    } catch (err) {
      console.log(err)
      next(err)
    }
  }

  static deleteVideo = async (req, res, next) => {
    try {
      const findData = await Video.findByPk(+req.params.id)
      if (!findData) {
        throw {
          name: "customError",
          msg: `404 not found`,
          status: 404
        }
      }

      const data = await Video.destroy({
        where: {
          id: +req.params.id
        }
      })

      if (data[0] !== 0) {
        res.status(200).json({msg: "Delete Video Completed!"})
      } else {
        throw {
          name: "customError",
          msg: "`Invalid ID",
          status: 404
        }
      }
    } catch (err) {
      next(err)
    }
  }

  static editVideo = async (req, res, next) => {
    try {
      const videos = fs.readFileSync('./key.csv', 'utf-8');
      const url = `data/${videos}`;

      const findData = await Video.findByPk(+req.params.id)
      if (!findData) {
        throw {
          name: "customError",
          msg: `404 not found`,
          status: 404
        }
      }

      const { title, thumbnail, isFree } = req.body
      const videoData = { title, url, thumbnail, isFree }

      const data = await Video.update(videoData, {
        where: {
          id: +req.params.id
        },
        returning: true
      })
      res.status(200).json(data)
    } catch (err) {
      next(err)
    }
  }
}

module.exports = VideoController