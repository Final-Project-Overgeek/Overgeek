const { User, Subscription } = require("../models");
const countDate = require("../helpers/countDate");
const { comparePassword } = require("../helpers/bcrypt");
const { generateToken } = require("../helpers/jwt");
const redis = require("../redis/index");

class UserController {
  static register = async (req, res, next) => {
    try {
      await redis.del("users");

      let userData = {
        username: req.body.username,
        email: req.body.email,
        password: req.body.password,
        phone_number: req.body.phone_number,
        premium: false,
        subscription_date: null,
        role: "customer",
      };
      // if (!req.body.role) {
      // } else {
      //   userData = {
      //     username: req.body.username,
      //     email: req.body.email,
      //     password: req.body.password,
      //     phone_number: req.body.phone_number,
      //     premium: false,
      //     subscription_date: null,
      //     role: "admin",
      //   };
      // }


      const user = await User.create(userData);

      res.status(201).json({
        id: user.id,
        username: user.username,
        email: user.email,
        phone_number: user.phone_number,
        role: user.role,
      });
    } catch (err) {
      next(err);
    }
  };

  static login = async (req, res, next) => {
    try {
      await redis.del("users");
      await redis.del("lecturersGame")
      await redis.del("lecturers")
      await redis.del("userRedis")
      const { email, password } = req.body;
      let user = await User.findOne({
        where: {
          email,
        },
      });

      if (!user) {
        user = await User.findOne({
          where: {
            username: email,
          },
        });
      }

      if (!user) {
        throw {
          name: "customError",
          msg: `Invalid email or password`,
          status: 400,
        };
      }

      if (user.subscription_date < new Date()) {
        const checkUser = await User.update(
          {
            ...user,
            premium: false,
          },
          {
            where: {
              id: user.id,
            },
          }
        );
      }

      const comparedPassword = comparePassword(password, user.password);
      if (!comparedPassword) {
        throw {
          name: "customError",
          msg: `Invalid email or password`,
          status: 400,
        };
      }

      const access_token = generateToken({
        id: user.id,
        email: user.email,
        username: user.username,
        phone_number: user.phone_number,
        subscription_date: user.subscription_date,
        role: user.role,
      });
      await redis.set('userRedis', JSON.stringify(user))
      res.status(200).json({ access_token });
    } catch (err) {
      next(err);
    }
  };

  static editUser = async (req, res, next) => {
    //minta name dari subscription type
    try {
      await redis.del("users");

      const userData = await User.findOne({
        where: {
          id: req.decoded.id,
        },
      });
      let subsType;
      const subscriptionDatas = await Subscription.findAll();
      for (let i = 0; i < subscriptionDatas.length; i++) {
        // Number(req.body.gross_amount.split('.')[0])
        if (subscriptionDatas[i].price === req.body.gross_amount) {
          subsType = subscriptionDatas[i].price;
        }
      }

      await Subscription.findOne({
        // where: {
        //   name: price,
        // }, ======================================> BEFORE , gak ada "name: price" ...????
        where: { // ===============================>> AFTER
          price: subsType,
        },
      });

      const expiredDate = countDate(subsType);

      const data = {
        ...userData,
        premium: true,
        subscription_date: expiredDate,
      };

      const editedData = await User.update(data, {
        where: {
          id: req.decoded.id,
        },
        returning: true,
      });
      res.status(200).json(editedData);
    } catch (err) {
      next(err);
    }
  };

  static readUser = async (req, res, next) => {
    try {
      const usersData = await redis.get("users");
      const parsedUser = JSON.parse(usersData)
      if (usersData && parsedUser.id === req.decoded.id) {
        res.status(200).json(JSON.parse(usersData));
      } else {
        const user = await User.findOne({
          where: {
            id: req.decoded.id,
          },
        });

        const data = {
          id: user.id,
          username: user.username,
          email: user.email,
          premium: user.premium,
          phone_number: user.phone_number,
          subscription_date: user.subscription_date,
        };

        await redis.set("users", JSON.stringify(data));
        res.status(200).json(data);
      }
    } catch (err) {
      next(err);
    }
  };

  static editPremiumUser = async (req, res, next) => {
    try {
    } catch (err) {
      next(err);
    }
  };
}

module.exports = UserController;
