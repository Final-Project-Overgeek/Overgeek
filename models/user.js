'use strict';
const { hashPassword } = require('../helpers/bcrypt')
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      User.hasOne(models.Rating, {foreignKey: 'UserId'})
      User.hasMany(models.Transaction, {foreignKey: 'UserId'})
      User.hasOne(models.Payment, {foreignKey: 'UserId'})
    }
  };
  User.init({
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: {
        args: true,
        msg: `Username Already Exist`
      },
      validate: {
        notEmpty: {
          args: true,
          msg: 'Username Cant be empty!'
        },
        notNull: {
          args: true,
          msg: 'Username cant be null!'
        }
      }
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: {
        args: true,
        msg: `Email already exist!`
      },
      validate: {
        notEmpty: {
          args: true,
          msg: 'Email cant be empty!'
        },
        isEmail: {
          args: true,
          msg: 'Invalid Email format!'
        },
        notNull: {
          args: true,
          msg: 'Email cannot be null!'
        }
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          args: true,
          msg: 'Password cant be empty!'
        },
        len: {
          args: [4],
          msg: 'Minimum character for password is 4!'
        },
        notNull: {
          args: true,
          msg: 'Password cant be null!'
        }
      }
    },
    premium: DataTypes.BOOLEAN,
    phone_number: DataTypes.STRING,
    subscription_date: DataTypes.DATE,
    role: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'User',
    hooks: {
      beforeCreate: (user, opt) => {
        user.password = hashPassword(user.password)
      }
    }
  });
  return User;
};