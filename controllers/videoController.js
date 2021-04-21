const { Video } = require("../models/");
const fs = require("fs");
const redis = require("../redis");

class VideoController {
  static readAllVideos = async (req, res, next) => {
    try {
      const videosData = await redis.get("videos");
      if (videosData) {
        res.status(200).json(JSON.parse(videosData));
      } else {
        const data = await Video.findAll();

        res.status(200).json(data);
        await redis.set("videos", JSON.stringify(data));
      }
    } catch (err) {
      next(err);
    }
  };

  static readOneVideo = async (req, res, next) => {
    try {
      const readOneVideo = await redis.get("video");
      const parsedData = JSON.parse(readOneVideo);
      if (readOneVideo) {
        parsedData.forEach((e) => {
          if (e.id === +req.params.id) {
            res.status(200).json(JSON.parse(readOneVideo));
          }
        });
      } else {
        const data = await Video.findOne({
          where: {
            id: +req.params.id,
          },
        });
        await redis.set("video", JSON.stringify(data));
        res.status(200).json(data);
      }
    } catch (err) {
      next(err);
    }
  };

  static addVideo = async (req, res, next) => {
    try {
      await redis.del("videos");
      await redis.del("video");

      const { title, thumbnail, isFree, url } = req.body;
      const data = await Video.create({
        title,
        url,
        thumbnail,
        isFree,
        LecturerId: +req.params.id,
      });

      res.status(201).json(data);
    } catch (err) {
      console.log(err);
      next(err);
    }
  };

  static deleteVideo = async (req, res, next) => {
    try {
      await redis.del("videos");
      await redis.del("video");
      const findData = await Video.findByPk(+req.params.id);

      if (!findData) {
        throw {
          name: "customError",
          msg: `404 not found`,
          status: 404,
        };
      }

      const data = await Video.destroy({
        where: {
          id: +req.params.id,
        },
      });

      if (data[0] !== 0) {
        res.status(200).json({ msg: "Delete Video Completed!" });
      } else {
        throw {
          name: "customError",
          msg: "`Invalid ID",
          status: 404,
        };
      }
    } catch (err) {
      next(err);
    }
  };

  static editVideo = async (req, res, next) => {
    try {

      await redis.del("videos");
      await redis.del("video");

      const findData = await Video.findByPk(+req.params.id);

      if (!findData) {
        throw {
          name: "customError",
          msg: `404 not found`,
          status: 404,
        };
      }

      const { title, thumbnail, isFree, url } = req.body;
      const videoData = { title, url, thumbnail, isFree };

      const data = await Video.update(videoData, {
        where: {
          id: +req.params.id,
        },
        returning: true,
      });
      res.status(200).json(data);
    } catch (err) {
      next(err);
    }
  };
}

module.exports = VideoController;
