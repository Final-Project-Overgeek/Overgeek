const { Subscription } = require("../models/");
const redis = require("../redis/index");

class SubsciptionController {
  static addSubscription = async (req, res, next) => {
    try {
      redis.del("subscriptions");

      const { name, image, price, days } = req.body;
      const subscriptionData = { name, image, price, days };

      const data = await Subscription.create(subscriptionData);

      res.status(201).json(data);
      await redis.del("subscriptions");
    } catch (err) {
      next(err);
    }
  };

  static readAllSubscriptions = async (req, res, next) => {
    try {
      const subscriptionData = await redis.get("subscriptions");
      if (subscriptionData) {
        res.status(201).json(JSON.parse(subscriptionData));
      } else {
        const data = await Subscription.findAll();
        res.status(200).json(data);
        await redis.set("subscriptions", JSON.stringify(data));
      }
    } catch (err) {
      next(err);
    }
  };

  static editSubscription = async (req, res, next) => {
    try {
      await redis.del("subscriptions");

      const findData = await Subscription.findByPk(+req.params.id);
      if (!findData) {
        throw {
          name: "customError",
          msg: `404 not found`,
          status: 404,
        };
      }

      const { name, image, price, days } = req.body;
      const subscriptionData = { name, image, price, days };

      const data = await Subscription.update(subscriptionData, {
        where: {
          id: +req.params.id,
        },
        returning: true,
      });
      if (data[0] !== 0) {
        res.status(200).json(data);
      } //else {
        // throw {
          // name: "customError",
          // msg: `404 not found`,
          // status: 404,
        // };
      // }
    } catch (err) {
      next(err);
    }
  };

  static deleteSubscription = async (req, res, next) => {
    try {
      await redis.del("subscriptions");

      const findData = await Subscription.findByPk(+req.params.id);
      if (!findData) {
        throw {
          name: "customError",
          msg: `404 not found`,
          status: 404,
        };
      }

      const data = await Subscription.destroy({
        where: {
          id: +req.params.id,
        },
      });

      if (data[0] !== 0) {
        res.status(200).json({ msg: "Subscription type deleted!" });
      } else {
        // throw {
        //   name: "customError",
        //   msg: "`Invalid ID",
        //   status: 404,
        // };
      }
    } catch (err) {
      next(err);
    }
  };
}

module.exports = SubsciptionController;
