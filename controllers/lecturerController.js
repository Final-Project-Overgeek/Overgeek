const { Lecturer, Rating, Video } = require("../models/");
const fs = require("fs");
const redis = require("../redis/index");

class LecturerController {
  static readAllLecturer = async (req, res, next) => {
    try {
      const lecturersData = await redis.get("lecturers");
      if (lecturersData) {
        res.status(200).json(JSON.parse(lecturersData));
      } else {
        const data = await Lecturer.findAll({
          include: [
            {
              model: Rating,
            },
            {
              model: Video,
            },
          ],
          attributes: [
            "id",
            "name",
            "profile",
            "game",
            "role",
            "team",
            "language",
            "image",
          ],
        });
        let output = [];
        for (let i = 0; i < data.length; i++) {
          let lecturerRating = 0;
          console.log(data[i]);
          for (let j = 0; j < data[i].dataValues.Ratings.length; j++) {
            lecturerRating += data[i].dataValues.Ratings[j].rating;
          }
          console.log(lecturerRating, "<<<<<<<< 1");
          if (lecturerRating === 0) {
            lecturerRating = 5;
            console.log(lecturerRating, "<<<<<<<< 2");
          } else {
            lecturerRating /= data[i].dataValues.Ratings.length;
            console.log(lecturerRating, "<<<<<<<< 3");
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
            videos: data[i].dataValues.Videos,
          });
        }
        await redis.set("lecturers", JSON.stringify(output));
        res.status(200).json(output);
      }
    } catch (err) {
      next(err);
    }
  };

  static readLecturerById = async (req, res, next) => {
    try {
      const lecturerById = await redis.get("lecturer");
      const parsedLecturer = JSON.parse(lecturerById);
      if (lecturerById) {
        parsedLecturer.forEach((e) => {
          if (e.id === +req.params.id) {
            res.status(200).json(JSON.parse(lecturerById));
          }
        });
      } else {
        const data = await Lecturer.findOne({
          where: {
            id: +req.params.id,
          },
          include: [
            {
              model: Video,
            },
            {
              model: Rating,
            },
          ],
          attributes: [
            "id",
            "name",
            "profile",
            "game",
            "role",
            "team",
            "language",
            "image",
          ],
        });

        if (!data) {
          throw {
            name: "customError",
            msg: `404 not found`,
            status: 404,
          };
        }
        let output = [];
        let lecturerRating = 0;
        for (let i = 0; i < data.dataValues.Ratings.length; i++) {
          lecturerRating += data.dataValues.Ratings[i].rating;
        }

        if (lecturerRating === 0) {
          lecturerRating = 5;
        } else {
          lecturerRating /= data.dataValues.Ratings.length;
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
          videos: data.dataValues.Videos,
        });
        await redis.set("lecture", JSON.stringify(output));
        res.status(200).json(output);
      }
    } catch (err) {
      next(err);
    }
  };

  static addLecturer = async (req, res, next) => {
    try {
      redis.del("lecturers");
      redis.del("lecturer");

      const dataFile = fs.readFileSync("./key.csv", "utf-8");
      const image = `data/${dataFile}`;

      const { name, profile, game, role, team, language } = req.body;
      const lecturerData = { name, profile, game, role, team, language, image };

      const data = await Lecturer.create(lecturerData);

      res.status(201).json(data);
    } catch (err) {
      next(err);
    }
  };

  static editLecturer = async (req, res, next) => {
    try {
      redis.del("lecturers");
      redis.del("lecturer");

      const dataFile = fs.readFileSync("./key.csv", "utf-8");
      const image = `data/${dataFile}`;

      const findData = await Lecturer.findByPk(+req.params.id);
      if (!findData) {
        throw {
          name: "customError",
          msg: `404 not found`,
          status: 404,
        };
      }

      const { name, profile, game, role, team, language } = req.body;
      const lecturerData = { name, profile, game, role, team, language, image };

      const data = await Lecturer.update(lecturerData, {
        where: {
          id: +req.params.id,
        },
        returning: true,
      });

      if (data[0] !== 0) {
        res.status(200).json(data);
      }
    } catch (err) {
      next(err);
    }
  };

  static deleteLecturer = async (req, res, next) => {
    try {
      redis.del("lecturers");
      redis.del("lecturer");

      const findData = await Lecturer.findByPk(+req.params.id);
      if (!findData) {
        throw {
          name: "customError",
          msg: `404 not found`,
          status: 404,
        };
      }

      const data = await Lecturer.destroy({
        where: {
          id: +req.params.id,
        },
      });

      if (data[0] !== 0) {
        res.status(200).json({ msg: "Delete Lecturer Completed!" });
      } else {
        // throw {
        //   name: "customError",
        //   msg: "`Invalid ID",
        //   status: 404
        // }
      }
    } catch (err) {
      next(err);
    }
  };

  static readLecturerByGame = async (req, res, next) => {
    try {
      let output = [];
      const lectureByGame = await redis.get("lecturersGame");
      const parsedData = JSON.parse(lectureByGame);
      if (parsedData !== null && req.query.game === parsedData[0].game) {
        res.status(200).json(JSON.parse(lectureByGame));
      } else {
        const data = await Lecturer.findAll({
          where: {
            game: req.query.game,
          },
          include: [
            {
              model: Rating,
            },
            {
              model: Video,
            },
          ],
        });

        for (let i = 0; i < data.length; i++) {
          let lecturerRating = 0;
          for (let j = 0; j < data[i].dataValues.Ratings.length; j++) {
            lecturerRating += data[i].dataValues.Ratings[j].rating;
          }
          if (lecturerRating === 0) {
            lecturerRating = 5;
          } else {
            lecturerRating /= data[i].dataValues.Ratings.length;
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
            videos: data[i].dataValues.Videos,
          });
        }
        // await redis.del('lecturersGame')
        await redis.set("lecturersGame", JSON.stringify(output));
        res.status(200).json(output);
      }
    } catch (err) {
      next(err);
    }
  };
}

module.exports = LecturerController;
